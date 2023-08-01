const IntentMatcher = require('./intent-matcher');
const ChatIntentMatcher = new IntentMatcher();

module.exports = class ChatManager { 
    constructor() {
        this.type = 'default';
    };

    async readMessage(userId, message) {
        console.log('messaging something')
        const response = await ChatIntentMatcher.detectIntent(userId, message, 'en');
        console.log(response[0].queryResult.fulfillmentMessages);
    };

    async sendMessage(userId, message) {

    };
};
