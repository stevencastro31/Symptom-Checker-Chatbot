import ExcelLoader from '@libs/excel-loader';
import firebase from "firebase-admin";
import dotenv from 'dotenv';
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
    const groupedModules: { [key: string]: typeof data } = result.groupedModules;
    const symptoms: string[] = result.symptoms;

    await Promise.all(symptoms.map(async (symptom) => {
        const document: any = {};

        for (const row of groupedModules[symptom]) {

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
    const propertyCount = 8;

    await Promise.all(data.map(async (item) => {
        const questions: string[] = [];
        let document: any = {};

        for (let i = 1; i <= propertyCount; i++) {
            const propertyName = `property${i}`;

            // Break Loop if Property is Empty
            if (!(item.hasOwnProperty(propertyName) && item[propertyName])) {
                break;
            }

            questions.push(item[propertyName]);
        }

        // Set the necessary information needed
        document = {
            questions: questions,
            next: item['next'] === '' ? null : item['next']
        }

        // Firestore Update
        await updateFirestore(collectionid, item.symptom, document);
    }));

};

// * Function to Group Module by Symptom Name
function groupModuleByDocument(data: Object[]) {
    const groupedModules: { [key: string]: typeof data } = {};
    const symptoms: string[] = [];
    data.forEach((item: any) => {
        if (!groupedModules[item.document] && item.document) {
            symptoms.push(item.document);
            groupedModules[item.document] = [];
        }
        if (item.document) {
            groupedModules[item.document].push(item);
        }
    });

    return { groupedModules, symptoms };
}

async function setData() {
    // ! For latest version of the file, Export xlsx file from Google Sheets
    const path : string = './extra/symptoms-modules.xlsx';

    await setDialogues(path, 'Introduction Dialogues', 'module_introduction');
    await setDialogues(path, 'Assessment Dialogues', 'module_assessment');
    await setDialogues(path, 'General Questions Dialogues', 'module_general_questions');
    await setSymptomElicitationDialogues(path, 'Symptom Elicitation Dialogues', 'module_symptom_elicitation');
    await setPropertyQuickReply(path, 'Property Quick Reply', 'module_property_reply');
    await setSymptomsKnowledgeBase(path, 'Symptom Knowledge Base', 'knowledge_base');
}

export { setData };
