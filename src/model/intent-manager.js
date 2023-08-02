const { IntentsClient } = require('@google-cloud/dialogflow').v2;
const Intent = require('./intent');

// require('dotenv').config({path: '../../env'});
// require('dotenv').config();

// const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
// const PROJECTID = CREDENTIALS.project_id;
// const CONFIGURATION = {
// 	credentials: {
// 		private_key: CREDENTIALS['private_key'],
// 		client_email: CREDENTIALS['client_email']	
// 	}
// }

// const intentsClient = new IntentsClient(CONFIGURATION);

module.exports = class IntentBuilder {
    constructor() {
        this.type = 'default';
    };

    createIntent(intent) {
        if (intent instanceof Intent) {

        } else {
            console.log('Create Intent Error: Parameter is not an Intent Class');
        }
    };

    deleteIntent(intent) {
        if (intent instanceof Intent) {

        } else {
            console.log('Delete Intent Error: Parameter is not an Intent Class');
        }
    };

    updateIntent(intent) {
        if (intent instanceof Intent) {
            
        } else {
            console.log('Update Intent Error: Parameter is not an Intent Class');
        }
    };
};