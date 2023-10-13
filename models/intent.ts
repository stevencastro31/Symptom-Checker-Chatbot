const BLOCK = '█';

interface TrainingPhrase {
    type: string,
    parts: Object[],
};

class Intent {
    delimiters: any;
    displayName: string;
    prompts: any;
    parameters: Object[];
    trainingPhrases: Object[];
    messages: Object[];
    contextPathTemplate: string;
    inputContextNames: string[];
    outputContexts: Object[];
    webhookState: number;
    isFallback: boolean;
    events: Object[];
    languageCode: string;
    action: string;

    constructor(intentJson: any, delimiters: any, contextPathTemplate: string) {
        if (delimiters === undefined || delimiters === null) {
            // * Default Delimiters
            this.delimiters = {
                trainingPhrases: ',',
                responsePhrases: ',',
                inputContext: ',',
                outputContext: ',',
                parameters: ',',
                events: ',',
                prompts: ',',
            };
        } else {
            this.delimiters = delimiters;
        }

        this.displayName = formatIntentName(intentJson.intentName);
        this.prompts = formatPrompts(intentJson.prompts, this.delimiters.prompts);
        this.parameters = formatParameters(intentJson.parameters, this.delimiters.parameters, this.prompts);
        this.trainingPhrases = formatTrainingPhrases(intentJson.trainingPhrases, this.delimiters.trainingPhrases);
        this.messages = formatResponsePhrases(intentJson.responsePhrases, this.delimiters.responsePhrases);
        this.contextPathTemplate = contextPathTemplate;
        this.inputContextNames = formatInputContext(intentJson.inputContext, this.delimiters.inputContext, this.contextPathTemplate);
        this.outputContexts = formatOutputContext(intentJson.outputContext, this.delimiters.outputContext, this.contextPathTemplate);
        this.webhookState = formatWebhookState(intentJson.isWebhook);
        this.isFallback = formatFallbackState(intentJson.isFallback);
        this.events = formatEvents(intentJson.events, this.delimiters.events);
        this.languageCode = formatLanguageCode(intentJson.languageCode);
        this.action = formatAction(intentJson.action);
    };

    buildIntentRequest(agentPath: string) {
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
                action: this.action,
            },
            languageCode: this.languageCode,
        };
        return intentRequest;
    };
};



function formatIntentName(intentName:string): string {
    if (intentName) {
        return intentName;
    } else {
        console.log('Name Error: Defined Intent Name has Invalid Format/Missing');
        return '';
    }
};

function formatTrainingPhrases(trainingPhrases: any, delimiter: string): Object[] {
    // * Training Phrases Format { (text).. {@(entityType):(entityText)} (text)... } Ex. I am {@sys.age: 22 years old}
    const formattedTrainingPhrases: Object[] = [];
    if (trainingPhrases) {
        const phrases: string[] = trainingPhrases.split(delimiter);
        
        phrases.forEach((phrase: string) => {
            try {
                const trainingPhrase: TrainingPhrase = {
                    type: 'EXAMPLE',
                    parts: []
                };
    
                phrase = phrase.replace('{', BLOCK);
                phrase = phrase.replace('}', BLOCK);
                const phraseParts: string[] = phrase.split(BLOCK);
    
                phraseParts.forEach((phrasePart: string) => {
                    if (phrasePart.startsWith('@')) {
                        const entityData = phrasePart.substring(1).split(':');
                           const part: any = {
                            text: entityData[1],
                            entityType: `@${entityData[0]}`,
                            alias: entityData[0].replace('.', '_').replace('-', '_'),
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

function formatResponsePhrases(responsePhrases: any, delimiter: string): Object[] {
    const formattedResponsePhrases: Object[] = [];
    if (responsePhrases) {
        try {
            const part = {
                text: responsePhrases.split(delimiter),
            };

            // ? platform: 'FACEBOOK',) 
            const responsePhrase = {
                text: part
            };
            formattedResponsePhrases.push(responsePhrase);
        } catch (exception) {
            console.log('Response Phrases Error: Defined Response Phrases has Invalid Format');
        }
    }
    return formattedResponsePhrases;
};

function formatInputContext(inputContext: any, delimiter: string, contextPathTemplate: string): string[] {
    const formattedInputContext: string[] = [];
    if (inputContext) {
        try {
            const contexts = inputContext.replace(/\s/g, "").split(delimiter);
            contexts.forEach((context: string) => {
                formattedInputContext.push(contextPathTemplate.replace('{CONTEXT}', context.toLowerCase()));
            });
        } catch (exception) {
            console.log(exception);
            console.log('Input Context Error: Defined Input Context has Invalid Format');
        }
    }
    return formattedInputContext;
};

function formatOutputContext(outputContext: any, delimiter: string, contextPathTemplate: string): Object[] {
    const formattedOutputContext: Object[] = [];
    // * Output Context Format { (ContextName):(Lifespan) } Ex. Introduction:3
    if (outputContext) {
        try {
            const contexts = outputContext.replace(/\s/g, "").split(delimiter);
            contexts.forEach((context: string) => {
                const outputContextData = context.split(':');
                const part = {
                    name: contextPathTemplate.replace('{CONTEXT}', outputContextData[0].toLowerCase()),
                    lifespanCount: parseInt(outputContextData[1])
                };              
                formattedOutputContext.push(part);
            });
        } catch (exception) {
            console.log('Output Context Error: Defined Output Context has Invalid Format');
        }
    }
    return formattedOutputContext;
};

function formatParameters(parameters: any, delimiter: string, prompts: string[]): Object[] {
    // // * Parameter Format { (type).(name):(isMandatory) } Ex. sys.name:1
    // * Parameter Format { @(entity_type).(name):$(value):(isMandatory):(isList) } Ex. sys.name:$sys_name:1:0
    // *                  { @(entity_type).(name):#(context).(value):(isMandatory):(isList) } Ex. sys.name:$sys_name:1:0
    
    // * Prompts Format   { @(entity_type):(prompt 1), prompt(2)... }

    const formattedParameters: Object[] = [];
    
    if (parameters) {
        parameters = parameters.replace(/\s/g, "").split(delimiter);
        parameters.forEach((parameter: string) => {
            parameter = parameter.replace('{', '');
            parameter = parameter.replace('}', '');

            try {
                const parameterData = parameter.split(':');
                const parameterName: any = parameterData[0];
                const parameterValue = parameterData[1];
                const parameterIsMandatory = parameterData[2] === '1';
                const parameterIsList = parameterData[3] === '1';

                // TODO: Implement Custom Prompts per Intent
                const part = {
                    displayName: parameterName.replace('@', '').replace('.', '_').replace('-', '_'),
                    entityTypeDisplayName: parameterName,
                    value: parameterValue,
                    mandatory: parameterIsMandatory,
                    isList: parameterIsList,
                    prompts: (prompts[parameterName]) ? (prompts[parameterName]) : ([`I'm sorry, I did not quite get that...`]),
                };
                formattedParameters.push(part);
            } catch (exception) {
                console.log('Parameter Error: Defined Parameter has Invalid Format');
            }
        });
    }
    return formattedParameters;
};

function formatEvents(events: any, delimiter: string): string[] {
    const formattedEvents: string[] = [];
    if (events) {
        events = events.replace(/\s/g, "").split(delimiter);
        events.forEach((event: string) => {
            try {
                formattedEvents.push(event.toLowerCase());
            } catch (exception) {
                console.log('Event Error: Defined Event has Invalid Format');
            }
        });
    };
    return formattedEvents;  
};

function formatWebhookState(webhookState: string): number { 
    return parseInt(webhookState);
};

function formatFallbackState(fallbackState: string): boolean {
    return (parseInt(fallbackState) === 1);
};

function formatLanguageCode(languageCode: string): string{
    if (languageCode) {
        return languageCode;
    } else {
        return 'en';
    }
};

function formatPrompts(prompts: any, delimiter: string): any {
    // * Prompts Format   { @(entity_type):{prompt 1}{prompt(2)}... }

    const promptJson: any = {};
    
    if (prompts) {
        prompts = prompts.split(delimiter);
        prompts.forEach((prompt: string) => {
            prompt = prompt.substring(1, prompt.length - 1);
            prompt = prompt.replace('}{', BLOCK);
            prompt = prompt.replace('{', BLOCK);
            prompt = prompt.replace('}', BLOCK);

            const promptData = prompt.split(':');
            try {
                const promptName = promptData[0];
                const promptPhrases = promptData[1].split(BLOCK).filter(phrase => { return phrase });
                promptJson[promptName] = promptPhrases;

            } catch (exeception) {
                console.log('Prompt Error: Defined Prompt has Invalid Format');
                console.log(prompts);
            };
        });
    }
    return promptJson;
};

function formatAction(action: string): string {
    return action;
};

export default Intent;

/*
    ? Add Support for Priority Property
    ? Add Support for Quick Replies
*/