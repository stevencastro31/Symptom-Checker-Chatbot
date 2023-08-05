const Intent = require('./model/intent');
const ExcelLoader = require('./model/excel-loader');
const IntentManager = require('./model/intent-manager');
const IntentMatcher = require('./model/intent-matcher');

require('dotenv').config({path: '../.env'});
require('dotenv').config();

IntentExcelLoader = new ExcelLoader();
const data = IntentExcelLoader.loadExcelSheet('../public/intent-definition.xlsx', 'intents');

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const EnglishIntentMatcher = new IntentMatcher(CREDENTIALS, 'en');
const FilipinoIntentMatcher = new IntentMatcher(CREDENTIALS, 'tl');

const intentManager = new IntentManager(JSON.parse(process.env.CREDENTIALS));

// Build Intent Object
// console.log(intentManager.getIntentId(intent));

async function main() {
    const intent = new Intent(data[0], null, intentManager.getProjectAgentSessionContextPathTemplate());

    // console.log(intent.buildIntentRequest());
    // return;


    const res = await EnglishIntentMatcher.detectIntent(123, 'testing');

    // await intentManager.deleteIntent(intent);
    // await intentManager.createIntent(intent);
};

main();

