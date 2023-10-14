import ExcelLoader from '@libs/excel-loader';
import Intent from '@libs/intent';
import IntentManager from '@libs/intent-manager';

import dotenv from 'dotenv';
dotenv.config();

import { ChatModule } from 'enums/module';
import { ChatLanguage } from 'enums/language';
import { ChatIntent } from 'enums/intent';

import { setData } from 'extra/symptom-dialogue';
import { getSymptomKnowledge } from '@libs/database';

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
    const start = 65;
    const end = 74;



    console.log(await getSymptomKnowledge('cough'));


    // for (let i = start -2; i < end -1; i++) {
    //     var intent = new Intent(data[i], delimiters, intentManager.getProjectAgentSessionContextPathTemplate());
    //     await intentManager.deleteIntent(intent);
    //     await intentManager.createIntent(intent);
    // }
    // const response = await getChatResponse(ChatModule.INTRODUCTION, ChatIntent.GREETING, ChatLanguage.ENGLISH);
    // console.log(response);       
};

main();
