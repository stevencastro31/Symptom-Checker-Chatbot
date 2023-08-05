const Intent = require('./model/intent');
const ExcelLoader = require('./model/excel-loader');
const IntentManager = require('./model/intent-manager');


require('dotenv').config({path: '../.env'});
require('dotenv').config();

IntentExcelLoader = new ExcelLoader();
const data = IntentExcelLoader.loadExcelSheet('../public/intent-definition.xlsx', 'intents');

const intentManager = new IntentManager(JSON.parse(process.env.CREDENTIALS));

// Build Intent Object
// console.log(intentManager.getIntentId(intent));

async function main() {
    const intent = new Intent(data[0], null, intentManager.getProjectAgentSessionContextPathTemplate());

    // console.log(intent.buildIntentRequest());
    // return;

    await intentManager.deleteIntent(intent);
    await intentManager.createIntent(intent);
};

main();

