import Dialogflow from '@google-cloud/dialogflow';
import dotenv from 'dotenv';
dotenv.config();
const { SessionsClient } = Dialogflow.v2;

const credential: any = JSON.parse(process.env.SERVICE_ACCOUNT ?? "");

class IntentMatcher {
    projectId:string ;
    configuration: any;
    languageCode: string;
    sessionClient: any;

    constructor(languageCode: string) {
        this.projectId = credential.project_id;
        this.configuration = {
            credentials: credential,
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
        return this.sessionClient.detectIntent(request);
    }
}

export default IntentMatcher;