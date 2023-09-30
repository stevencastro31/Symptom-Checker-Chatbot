import ExcelLoader from '@libs/excel-loader';
import Intent from '@libs/intent';
import IntentManager from '@libs/intent-manager';
import firebase from "firebase-admin";
const Timestamp = firebase.firestore.Timestamp




import dotenv from 'dotenv';
dotenv.config();

import { getChatResponse, getUser, setUser } from '@libs/database';
import { ChatModule } from 'enums/module';
import { ChatLanguage } from 'enums/language';
import { ChatIntent } from 'enums/intent';

const loader = new ExcelLoader();

const data: Object[] = loader.loadExcelSheet('intent-definition.xlsx', 'intents-en');
const intentManager = new IntentManager();

const delimiters = {
    trainingPhrases: '|',
    responsePhrases: '|',
    inputContext: ',',
    outputContext: ',',
    parameters: ',',
    events: ',',
    prompts: ',',
};

async function main() {
    // for (let i = 7; i < 8; i++) {
    //     var intent = new Intent(data[i], delimiters, intentManager.getProjectAgentSessionContextPathTemplate());
    //     await intentManager.deleteIntent(intent);
    //     await intentManager.createIntent(intent);
    // }

    const user = {
        date_created: firebase.firestore.FieldValue.serverTimestamp(),
        current_session: 'session_id',
        general: { name: 'John', age: 19, sex: 'male' },
        settings: { language: 'english', privacy_policy: true },
        sessions: [
            'DocumentReference',
            'DocumentReference'
        ],
    };

    let data: any = await getUser("123456789");
    console.log(data);

    data = await getUser("123456789123");
    console.log(data);

    console.log(data.settings.language ?? ChatLanguage.ENGLISH);


    // console.log(await setUser("1234567891", user));

    // const response = await getChatResponse(ChatModul e.INTRODUCTION, ChatIntent.GREETING, ChatLanguage.ENGLISH);
};

main();



// {
//     current_session: Timestamp { _seconds: 1696003200, _nanoseconds: 630000000 },
//     general: { name: 'John', age: 19, sex: 'male' },
//     sessions: [
//       DocumentReference {
//         _firestore: [Firestore],
//         _path: [ResourcePath],
//         _converter: [Object]
//       },
//       DocumentReference {
//         _firestore: [Firestore],
//         _path: [ResourcePath],
//         _converter: [Object]
//       }
//     ],
//     settings: { language: 'english', privacy_policy: true }
//   }