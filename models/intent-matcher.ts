import Dialogflow from '@google-cloud/dialogflow';
const { SessionsClient } = Dialogflow.v2;

class IntentMatcher {
    projectId:string ;
    configuration: any;
    languageCode: string;
    sessionClient: any;

    constructor(credentials: any, languageCode: string) {
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

    async detectIntent(userId: string, text: string) {
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
        return await this.sessionClient.detectIntent(request);
    }
}

export default IntentMatcher;