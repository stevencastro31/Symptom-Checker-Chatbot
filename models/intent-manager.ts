import Dialogflow from '@google-cloud/dialogflow';
import Intent from '@libs/intent';
import dotenv from 'dotenv';
dotenv.config();

const { IntentsClient, } = Dialogflow.v2;
const credential: any = JSON.parse(process.env.SERVICE_ACCOUNT ?? "");

class IntentManager {
    projectId: string;
    configuration: any;
    intentClient: any;

    constructor() {
        this.projectId = credential.project_id;
        this.configuration = {
            credentials: credential,
        }
        this.intentClient = new IntentsClient(this.configuration);
    };

    async createIntent(intent: any) {
        if (intent instanceof Intent) {
            const request = intent.buildIntentRequest(this.intentClient.projectAgentPath(this.projectId));
            const [response] = await this.intentClient.createIntent(request);
            console.log(`Created Intent: ${response.displayName}`);
        } else {
            console.log('Create Intent Error: Parameter is not an Intent Class');
        }
    };

    async updateIntent(intent: any) {
        if (intent instanceof Intent) {
            const request = intent.buildIntentRequest(this.intentClient.projectAgentPath(this.projectId));
            const id = await this.getIntentId(intent);
            request.intent.name = id;
            const [response] = await this.intentClient.updateIntent(request);
            console.log(`Updated Intent: ${response.displayName}`);
        } else {
            console.log('Create Update Error: Parameter is not an Intent Class');
        }
    };

    async deleteIntent(intent: any) {
        if (intent instanceof Intent) {
            const intentId = await this.getIntentId(intent);
            const request = {
                name: intentId,
            };
            if (request.name === null) {
                return;
            }
            const response = await this.intentClient.deleteIntent(request);
            console.log(`Deleted Intent: ${intent.displayName}`);
        } else {
            console.log('Delete Intent Error: Parameter is not an Intent Class');
        }
    };

    async getIntentId(intent: any) {
        if (intent instanceof Intent) {
            var intentId = null;
            const displayName = intent.displayName;
            const request = {
                parent: this.intentClient.projectAgentPath(this.projectId),
            };
            const [response] = await this.intentClient.listIntents(request);
            response.every((intentData: any) =>  {
                if (intentData.displayName === displayName) {
                    intentId = intentData.name;
                    return false;
                } else {
                    return true;
                }
            });
            return intentId;
        } else {
            console.log('Get Intent ID Error: Parameter is not an Intent Class');
        }    
    }

    getProjectAgentSessionContextPathTemplate() {
        return this.intentClient.projectAgentSessionContextPath(this.projectId, 'token', '{CONTEXT}');
    };
};

export default IntentManager;