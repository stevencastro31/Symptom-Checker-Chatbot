const { SessionsClient } = require('@google-cloud/dialogflow').v2;

module.exports = class IntentMatcher {
    constructor(credentials, languageCode) {
        this.projectId = credentials.project_id;
        this.configuration = {
            credentials: {
                private_key: credentials['private_key'],
                client_email: credentials['client_email']	
            }
        }
        this.languageCode = languageCode;
        this.sessionClient = new SessionsClient(this.configuration);
    };

    async detectIntent(userId, text) {
        const sessionPath = this.sessionClient.projectAgentSessionPath(this.projectId, userId);
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
        return this.sessionClient.detectIntent(request);
    }
}