import ExcelLoader from '@libs/excel-loader';
import Intent from '@libs/intent';
import IntentManager from '@libs/intent-manager';

import dotenv from 'dotenv';
dotenv.config();

import { ChatModule } from 'enums/module';
import { ChatLanguage } from 'enums/language';
import { ChatIntent } from 'enums/intent';

import { setData } from 'extra/symptom-dialogue';
import { getChatReply, getSymptomKnowledge } from '@libs/database';
import { ChatQuickReply } from 'enums/quick_reply';
import { probeNextSymptom } from '@fulfillment/probing';

const loader = new ExcelLoader();

const data_en: Object[] = loader.loadExcelSheet('intent-definition.xlsx', 'intents-en');
const data_tl: Object[] = loader.loadExcelSheet('intent-definition.xlsx', 'intents-tl');
const intentManager = new IntentManager();

const delimiters = {
    trainingPhrases: '|',
    responsePhrases: '|',
    inputContext: ',',
    outputContext: ',',
    parameters: ',',
    events: ',',
    prompts: '|',
};

async function main() {
    // * Update Firestore
    // await setData();


    // 16-46

    // * Update Intents
    const start = 75;
    const end = 75;
    for (let i = start -2; i < end -1; i++) {
        var intent_en = new Intent(data_en[i], delimiters, intentManager.getProjectAgentSessionContextPathTemplate());
        var intent_tl = new Intent(data_tl[i], delimiters, intentManager.getProjectAgentSessionContextPathTemplate());
        // await intentManager.deleteIntent(intent_en);
        // await intentManager.createIntent(intent_en);
        await intentManager.updateIntent(intent_en);
        await intentManager.updateIntent(intent_tl);
    }

    // console.log(await getSymptomKnowledge('cough'));
    // console.log(await getChatReply('agreement', ChatLanguage.TAGALOG));
    // const response = await getChatResponse(ChatModule.INTRODUCTION, ChatIntent.GREETING, ChatLanguage.ENGLISH);
    // console.log(response);   
    

    // console.log(probeNextSymptom([0, 1, 2, 3, 4]));
    // console.log(probeNextSymptom([1, 3, 2, 3, 1]));
    // console.log(probeNextSymptom([0, 0, 2, 3, 2]));
    // console.log(probeNextSymptom([0, 0, 0, 0, 1]));
};

main();
