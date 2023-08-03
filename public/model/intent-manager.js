const { IntentsClient } = require('@google-cloud/dialogflow').v2;
const Intent = require('./intent');

module.exports = class IntentManager {
    constructor(credentials) {
        this.projectId = credentials.project_id;
        this.configuration = {
            credentials: {
                private_key: credentials['private_key'],
                client_email: credentials['client_email']	
            }
        }
        this.intentClient = new IntentsClient(this.configuration);
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

    getProjectAgentSessionContextPathTemplate() {
        return this.intentClient.projectAgentSessionContextPath(this.projectId, 'token', '{CONTEXT}');
    };
};