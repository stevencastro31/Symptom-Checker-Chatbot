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

// update symptoms module
async function setSymptom(symptomid: string, data: Object) {
    try {
        const res = await database.collection('module_symptoms').doc(symptomid).set(data);
    } catch (err) {
        console.log(err);
    };
};

// get value from excel file
async function setDialogues() {
    const data: Object[] = loader.loadExcelSheet('symptoms-module-dialogues.xlsx', 'Symptoms'); // for latest version of the file, export xlsx file from google sheets and use here
    const symptoms: string[] = [];
    const groupedModules: { [key: string]: typeof data } = {};
    data.forEach((item: any) => {
        if (!groupedModules[item.module]) {
            symptoms.push(item.module);
            groupedModules[item.module] = [];
        }
        groupedModules[item.module].push(item);
    });
    // iterate through all symptoms
    for (const symptom of symptoms) {
        const document: any = {};

        groupedModules[symptom].forEach(async (row: any) => {
            const dialogue: any = {};
            for (const key in row) {
                // dont include those with empty values
                if ((key.startsWith('english') || key.startsWith('tagalog')) && row[key]) {
                    dialogue[key] = row[key].split('|');
                }
            }
            document[row.document] = dialogue;
        });
        // add to firestore
        await setSymptom(symptom, document);
    }
};

export { setDialogues };
