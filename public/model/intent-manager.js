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

    async createIntent(intent) {
        if (intent instanceof Intent) {
            const request = intent.buildIntentRequest(this.intentClient.projectAgentPath(this.projectId));
            const [response] = await this.intentClient.createIntent(request);
            console.log(`Created Intent: ${response.displayName}`);
        } else {
            console.log('Create Intent Error: Parameter is not an Intent Class');
        }
    };

    async deleteIntent(intent) {
        if (intent instanceof Intent) {
            const intentId = await this.getIntentId(intent);
            const request = {
                name: intentId,
            };
            const response = await this.intentClient.deleteIntent(request);
            console.log(`Deleted Intent: ${intent.displayName}`);
        } else {
            console.log('Delete Intent Error: Parameter is not an Intent Class');
        }
    };

    async updateIntent(intent) {
        if (intent instanceof Intent) {

        } else {
            console.log('Update Intent Error: Parameter is not an Intent Class');
        }
    };

    async getIntentId(intent) {
        if (intent instanceof Intent) {
            var intentId = null;
            const displayName = intent.displayName;
            const request = {
                parent: this.intentClient.projectAgentPath(this.projectId),
            };
            const [response] = await this.intentClient.listIntents(request);
            response.every(intentData =>  {
                if (intentData.displayName === displayName) {
                    intentId = intentData.name;
                    console.log(intentId);
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


const getIntentID = async (inputName) => {
	var agentPath = intentClient.projectAgentPath(PROJECTID);

	var req = {
		parent: agentPath
	}

	var [res] = await intentClient.listIntents(req);
	var intentID = [];

	res.every(intent => {
		if (inputName === intent.displayName) {
			intentID.push(intent.name);
			return false;
		} else {
			return true;
		}
	});
	return intentID[0];
}
