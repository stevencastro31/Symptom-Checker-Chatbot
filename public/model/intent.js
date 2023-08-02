module.exports = class Intent {
    constructor(intentJson, delimiters) {
        if (delimiters === undefined) {
            // * Default Delimiters
            this.delimiters = {
                trainingPhrases: ',',
                responsePhrases: ',',
                inputContext: ',',
                outputContext: ',',
                parameters: ',',
                events: ',',
            };
        } else {
            this.delimiters = delimiters;
        }

        this.displayName = formatIntentName(intentJson.intentName);
        this.parameters = formatParameters(intentJson.parameters, this.delimiters.parameters);
        this.trainingPhrases = formatTrainingPhrases(intentJson.trainingPhrases, this.delimiters.trainingPhrases);
        this.messages = formatResponsePhrases(intentJson.responsePhrases, this.delimiters.responsePhrases);
        this.inputContextNames = formatInputContext(intentJson.inputContext, this.delimiters.inputContext);
        this.outputContexts = formatOutputContext(intentJson.outputContext, this.delimiters.outputContext);
        this.webhookState = formatWebhookState(intentJson.isWebhook);
        this.isFallback = formatFallbackState(intentJson.isFallback);
        this.events = formatEvents(intentJson.events, this.delimiters.events);
        this.languageCode = formatLanguageCode(intentJson.languageCode);
    };

    buildIntentRequest(agentPath) {
        const intentRequest = {
            parent: agentPath,
            intent: {
                displayName: this.displayName,
                trainingPhrases: this.trainingPhrases,
                messages: this.messages,
                inputContextNames: this.inputContextNames,
                outputContexts: this.outputContexts,
                webhookState: this.webhookState,
                isFallback: this.isFallback,
                parameters: this.parameters,
                events: this.events,
            },
            languageCode: this.languageCode,
        };
        return intentRequest;
    };
};

const BLOCK = '█';

function formatIntentName(intentName) {
    return intentName;
};

function formatTrainingPhrases(trainingPhrases, delimiter) {
    // * Training Phrases Format { (text).. {@(entityType):(entityText)} (text)... } Ex. I am {@sys.age: 22 years old}
    const formattedTrainingPhrases = [];
    if (trainingPhrases) {
        const phrases = trainingPhrases.split(delimiter);
        
        phrases.forEach(phrase => {
            try {
                const trainingPhrase = {
                    type: 'EXAMPLE',
                    parts: []
                };
    
                phrase = phrase.replace('{', BLOCK);
                phrase = phrase.replace('}', BLOCK);
                const phraseParts = phrase.split(BLOCK);
    
                phraseParts.forEach(phrasePart => {
                    if (phrasePart.startsWith('@')) {
                        const entityData = phrasePart.substring(1).split(':');
                           const part = {
                            text: entityData[1],
                            entityType: `@${entityData[0]}`,
                            alias: entityData[0].replace('.', '_'),
                            userDefined: true
                        };
                        trainingPhrase.parts.push(part);
                    } else if (phrasePart) {
                        const part = {
                            text: phrasePart,
                        };
                        trainingPhrase.parts.push(part);
                    }  
                });
                formattedTrainingPhrases.push(trainingPhrase);
            } catch (exception) {
                console.log('Training Phrase Error: Defined Training Phrase has Invalid Format')
            }
        });
    }
    return formattedTrainingPhrases;
};

function formatResponsePhrases(responsePhrases, delimiter) {
    const formattedResponsePhrases = [];
    if (responsePhrases) {
        try {
            const part = {
                text: json.responsePhrases.split(delimiter);
            };

            // ? platform: 'FACEBOOK',) 
            const responsePhrase = {
                // platform: 'FACEBOOK',
                text: part
            };
            formattedResponsePhrases.push(responsePhrase);
        } catch (exception) {
            console.log('Response Phrases Error: Defined Response Phrases has Invalid Format');
        }
    }
    return formattedResponsePhrases;
};

function formatInputContext(inputContext, delimiter) {
    return inputContext;
};

function formatOutputContext(outputContext, delimiter) {
    return outputContext;
};

function formatParameters(parameters, delimiter) {
    // * Parameter Format { (type).(name):(isMandatory) } Ex. sys.name:1
    const formattedParameters = [];
    if (parameters) {
        parameters = parameters.replace(/\s/g, "").split(delimiter);
        parameters.forEach(parameter => {
            try {
                const parameterName = parameter.split(':')[0];
                const parameterIsMandatory = parameter.split(':')[1] === '1';
                
                // TODO: Implement Custom Prompts per Intent
                // ! Display Name may affect Dialogflow Fullfilment Investigate Further
                const part = {
                    displayName: parameterName.replace('.', '_'),
                    mandatory: parameterIsMandatory,
                    entityTypeDisplayName: `@${parameterName}`,
                    prompts: [`I'm sorry, I did not quite get that...`]
                };

                formattedParameters.push(part);
            } catch (exception) {
                console.log('Parameter Error: Defined Parameter has Invalid Format');
            }
        });
    }
    return formattedParameters;
};

function formatEvents(events, delimiter) {
    const formattedEvents = [];
    if (events) {
        events = events.replace(/\s/g, "").split(delimiter);
        events.forEach(event => {
            try {
                formattedEvents.push(event);
            } catch (exception) {
                console.log('Event Error: Defined Event has Invalid Format');
            }
        });
    };
    return formattedEvents;  
};

function formatWebhookState(webhookState) { 
    return (webhookState === '1') ? 'WEBHOOK_STATE_ENABLED' : 'WEBHOOK_STATE_UNSPECIFIED';
};

function formatFallbackState(fallbackState) {
    return (fallbackState === '1');
};

function formatLanguageCode(languageCode) {
    if (languageCode) {
        return languageCode;
    } else {
        return 'en';
    }
}

/*
    ? Add Support for Priority Property
*/