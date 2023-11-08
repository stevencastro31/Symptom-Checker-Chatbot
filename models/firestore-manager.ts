import ExcelLoader from '@libs/excel-loader';
import firebase from "firebase-admin";
import dotenv from 'dotenv';
import xlsx from 'xlsx';
dotenv.config();

const credential: Object = JSON.parse(process.env.SERVICE_ACCOUNT ?? "");
firebase.initializeApp({
    credential: firebase.credential.cert(credential),
});

const database = firebase.firestore();
const loader = new ExcelLoader();

// * Firestore Update
async function updateFirestore(collectionid: string, symptomid: string, data: Object) {
    try {
        const res = await database.collection(collectionid).doc(symptomid).set(data);
        console.log(`Updated Firestore: ${collectionid} - ${symptomid}`);
    } catch (err) {
        console.log(err);
    };
};

// * Dialogues
async function setDialogues(path_name: string, sheet_name: string, collectionid: string) {
    const data: Object[] = loader.loadExcelSheet(path_name, sheet_name);

    await Promise.all(data.map(async (row: any) => {
        const document: any = {};

        for (const key in row) {

            // Get English & Tagalog; Exclude those with empty values
            if ((key.startsWith('english') || key.startsWith('tagalog')) && row[key]) {

                const language = key;

                if (!document[language]) {
                    document[language] = [];
                }

                document[language] = row[key].split('|');
            }
        }

        // Firestore Update
        await updateFirestore(collectionid, row.document, document);
    }));
}

async function setSymptomElicitationDialogues(path_name: string, sheet_name: string, collectionid: string) {
    const data: any[] = loader.loadExcelSheet(path_name, sheet_name); // for latest version of the file, export xlsx file from google sheets and use here
    const result = groupModuleByDocument(data);
    const grouped_modules: { [key: string]: typeof data } = result.grouped_modules;
    const symptoms: string[] = result.symptoms;

    await Promise.all(symptoms.map(async (symptom) => {
        const document: any = {};

        for (const row of grouped_modules[symptom]) {

            for (const key in row) {

                // Get English & Tagalog; Exclude those with empty values
                if ((key.startsWith('english') || key.startsWith('tagalog')) && row[key]) {
                    const language = key;

                    if (!document[language]) {
                        document[language] = {};
                    }

                    if (!document[language][row.question]) {
                        document[language][row.question] = [];
                    }

                    document[language][row.question] = row[key].split('|');
                }
            }
        }

        // Firestore Update
        await updateFirestore(collectionid, symptom, document);

    }));
};

// * Quick Replies
async function setPropertyQuickReply(path_name: string, sheet_name: string, collectionid: string) {
    const data: any[] = loader.loadExcelSheet(path_name, sheet_name);

    await Promise.all(data.map(async (row: any) => {
        const document: any = {};

        for (const key in row) {

            // Get English & Tagalog; Exclude those with empty values
            if ((key.startsWith('english') || key.startsWith('tagalog')) && row[key]) {
                document[key] = row[key].split('|');
            }
        }

        // Firestore Update
        await updateFirestore(collectionid, row.property, document);
    }));
}

// * Knowledge Base
async function setSymptomsKnowledgeBase(path_name: string, sheet_name: string, collectionid: string) {
    const data: any[] = loader.loadExcelSheet(path_name, sheet_name); 
    const property_count = 8;
    const associations_count = 3;

    await Promise.all(data.map(async (item) => {
        const questions: string[] = [];
        const associations: string[] = [];
        let document: any = {};

        // Properties Loop
        for (let i = 1; i <= property_count; i++) {
            const property_name = `property${i}`;

            // Break Loop if Property is Empty
            if (!(item.hasOwnProperty(property_name) && item[property_name])) {
                break;
            }

            questions.push(item[property_name]);
        }

        // Associations Loop
        for (let i = 1; i <= associations_count; i++) {
            const association_name = `association${i}`;

            // Break Loop if Property is Empty
            if (!(item.hasOwnProperty(association_name) && item[association_name])) {
                break;
            }

            associations.push(item[association_name]);
        }
        // Set the necessary information needed
        document = {
            associations: associations,
            questions: questions,
            next: item['next'] === '' ? null : item['next']
        }

        // Firestore Update
        await updateFirestore(collectionid, item.symptom, document);
    }));

};

// * Function to Group Module by Symptom Name
function groupModuleByDocument(data: Object[]) {
    const grouped_modules: { [key: string]: typeof data } = {};
    const symptoms: string[] = [];
    data.forEach((item: any) => {
        if (!grouped_modules[item.document] && item.document) {
            symptoms.push(item.document);
            grouped_modules[item.document] = [];
        }
        if (item.document) {
            grouped_modules[item.document].push(item);
        }
    });

    return { grouped_modules, symptoms };
}

// * Association
async function setAssociation(path_name: string, sheet_name: string, collectionid: string) {
    const workbook = xlsx.readFile(path_name);
    
    const headers: string[] = ['User', 'symptoms', 'asthma', 'emphysema', 'bronchitis', 'pneumonia', 'tuberculosis', 'covid_19', 'cardiomyopathy', 'hypertension', 'hypotension', 'valvular_heart_disease', 'coronary_artery_disease', 'myocardial_infarction', 'Max', 'U. Wgt'];
    const excluded: string[] = ['User', 'Max', 'U. Wgt'];

    const worksheet: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name], { defval: 0, header: headers });

    const symptoms: string[] = [];
    const data: any = {}
    const weights: any = [];

    for (let header of headers) {
        if (excluded.includes(header)) continue;

        const vector: any[] = [];

        for (let i = 3; i <= 43; i++) {
            if (header === 'symptoms') { symptoms.push(worksheet[i][header]); }
            else { vector.push(worksheet[i][header]); }
        }

        if (header === 'symptoms') continue;

        const disease_weight = { name: header, vector: vector }
        weights.push(disease_weight);
    }

    data['threshold'] = 0.75;
    data['weights'] = weights;
    data['symptoms'] = symptoms;

    await updateFirestore(collectionid, 'diseases', data);
    
}
async function setData() {
    // ! For latest version of the file, Export xlsx file from Google Sheets
    const path : string = './symptoms-modules.xlsx';

    setAssociation(path, 'Association', 'knowledge_base');
    // await setDialogues(path, 'Introduction Dialogues', 'module_introduction');
    // await setDialogues(path, 'Assessment Dialogues', 'module_assessment');
    // await setDialogues(path, 'General Questions Dialogues', 'module_general_questions');
    // await setSymptomElicitationDialogues(path, 'Symptom Elicitation Dialogues', 'module_symptom_elicitation');
    // await setPropertyQuickReply(path, 'Property Quick Reply', 'module_property_reply');
    // await setSymptomsKnowledgeBase(path, 'Symptom Knowledge Base', 'knowledge_base');
}

export { setData };
