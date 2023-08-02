module.exports = class Intent {
    constructor(name, trainingPhrases, responsePhrases, inputContext, outputContext, parameters, events, webhookEnabled) {
        this.name = name;
        this.trainingPhrases = trainingPhrases;
        this.responsePhrases = responsePhrases;
        this.inputContext = inputContext;
        this.outputContext = outputContext;
        this.parameters = parameters;
        this.events = events;
        this.webhookEnabled = webhookEnabled;
    };
};