const Intent = require('./intent');
const ExcelLoader = require('./excel-loader');
const IntentManager = require('./intent-manager');


ChatIntentManager = new IntentManager();
IntentExcelLoader = new ExcelLoader();


console.log(IntentExcelLoader.loadExcelSheet('../../public/intent-definition.xlsx', 'introduction'));


// ChatIntentManager.createIntent(new Intent(1, 1, 1, 1, 1, 1, 1, 1));
// ChatIntentManager.createIntent(123);


/*








    Hello there, I am Steven!

    Is there a problem?

    ,.:()!-_/""|||||

    | ? 

    Intent time symptom

    I have been {@symptom:coughing} for a while now


*/