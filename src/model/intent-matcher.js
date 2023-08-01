const { SessionsClient } = require('@google-cloud/dialogflow').v2;

require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const PROJECTID = CREDENTIALS.project_id;
const CONFIGURATION = {
	credentials: {
		private_key: CREDENTIALS['private_key'],
		client_email: CREDENTIALS['client_email']	
	}
}

const sessionClient = new SessionsClient(CONFIGURATION);

module.exports = class IntentMatcher {
    constructor(languageCode) {
        this.languageCode = languageCode;
    };

    async detectIntent(userId, text) {
        const sessionPath = sessionClient.projectAgentSessionPath(PROJECTID, userId);
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: this.languageCode,
                }
            },
            queryParams: {
                analyzeQueryTextSentiment: true,
            },
        };
        return sessionClient.detectIntent(request);
    }
}