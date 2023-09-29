import ExcelLoader from '@libs/excel-loader';
import Intent from '@libs/intent';
import IntentManager from '@libs/intent-manager';

import dotenv from 'dotenv';
dotenv.config();

import { getModule } from '@libs/database';

const loader = new ExcelLoader();

const data: Object[] = loader.loadExcelSheet('intent-definition.xlsx', 'base')
const intentManager = new IntentManager();

async function main() {
    var intent = new Intent(data[0], null, intentManager.getProjectAgentSessionContextPathTemplate());
    await intentManager.deleteIntent(intent);
    await intentManager.createIntent(intent);

    // getModule('123');
};

main();