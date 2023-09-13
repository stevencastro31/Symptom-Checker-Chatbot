import ExcelLoader from '@libs/excel-loader';
import Intent from '@libs/intent';
import IntentManager from '@libs/intent-manager';
import dotenv from 'dotenv';

dotenv.config();
const loader = new ExcelLoader();
const credentials = JSON.parse(process.env.CREDENTIALS ?? '');

const data: Object[] = loader.loadExcelSheet('intent-definition.xlsx', 'intents')
const intentManager = new IntentManager(credentials);

async function main() {
    var intent = new Intent(data[6], null, intentManager.getProjectAgentSessionContextPathTemplate());
    await intentManager.deleteIntent(intent);
    await intentManager.createIntent(intent);
};

main();