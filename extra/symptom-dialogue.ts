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

// update firestore
async function updateFirestore(collectionid: string, symptomid: string, data: Object) {
    try {
        const res = await database.collection(collectionid).doc(symptomid).set(data);
        console.log(`Updated Firestore: ${collectionid} - ${symptomid}`);
    } catch (err) {
        console.log(err);
    };
};

// questions bank
async function setSymptomElicitationDialogues() {
    const data: Object[] = loader.loadExcelSheet('./extra/symptoms-modules.xlsx', 'Symptom Elicitation Dialogues'); // for latest version of the file, export xlsx file from google sheets and use here
    const symptoms: string[] = [];
    const groupedModules: { [key: string]: typeof data } = {};
    data.forEach((item: any) => {
        if (!groupedModules[item.document] && item.document) {
            symptoms.push(item.document);
            groupedModules[item.document] = [];
        }
        if (item.document) {
            groupedModules[item.document].push(item);
        }
    });

    // iterate through all symptoms
    for (const symptom of symptoms) {
        const document: any = {};

        groupedModules[symptom].forEach(async (row: any) => {

            for (const key in row) {
                // dont include those with empty values
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
        });
        // add to firestore
       await updateFirestore('module_symptom_elicitation', symptom, document);
    }
    
};

// knowledge base
async function setSymptomsKnowledgeBase() {
    const data: any[] = loader.loadExcelSheet('./extra/symptoms-modules.xlsx', 'Symptom Knowledge Base'); // for latest version of the file, export xlsx file from google sheets and use here
    const propertyCount = 8;

    for (const item of data) {
        const questions: string[] = [];
        let document: any = {};
        for (let i = 1; i <= propertyCount; i++) {
            const propertyName = `property${i}`;

            if(item.hasOwnProperty(propertyName) && item[propertyName]) {
                questions.push(item[propertyName]);
            }
            else {  // break loop if the property is empty
                break;
            }
        }

        document = {
            questions: questions,
            next: item['next'] === '' ? null : item['next']
        }
        // add to firestore
        await updateFirestore('knowledge_base', item.symptom, document);
    }
};

// quick replies
async function setPropertyQuickReply() {
    const data: any[] = loader.loadExcelSheet('./extra/symptoms-modules.xlsx', 'Property Quick Reply'); // for latest version of the file, export xlsx file from google sheets and use here

    data.forEach(async (row: any) => {
        const dialogue: any = {};

        for (const key in row) {
            // dont include those with empty values
            if ((key.startsWith('english') || key.startsWith('tagalog')) && row[key]) {
                dialogue[key] = row[key].split('|');
            }
        }
        // add to firestore
        await updateFirestore('module_property_reply', row.property, dialogue);
    });

}

async function setData() {
    await setSymptomElicitationDialogues();
    await setSymptomsKnowledgeBase();
    await setPropertyQuickReply();
}

export { setData };
