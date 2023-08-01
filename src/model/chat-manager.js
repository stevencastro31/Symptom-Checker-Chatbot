const IntentMatcher = require('./intent-matcher');
const EnglishIntentMatcher = new IntentMatcher('en');
const FilipinoIntentMatcher = new IntentMatcher('tl');
const axios = require('axios');

module.exports = class ChatManager { 
    constructor() {
        this.type = 'default';
    };

    // TODO: Implement language switch w/ knowledge base
    async readMessage(userId, message) {
        return EnglishIntentMatcher.detectIntent(userId, message);
    };

    async sendMessage(userId, messages) {
        const accessToken = process.env.PAGE_ACCESS_TOKEN;
        messages.forEach(async (message) => {
            const text = message.text.text[0];
            try {
                const response = await axios.post(
                  `https://graph.facebook.com/v15.0/me/messages?access_token=${accessToken}`,
                  {
                    messaging_type: 'RESPONSE',
                    recipient: {
                      id: userId
                    },
                    message: {
                      text: text
                    }
                  }
                );
            } catch (error) {
                console.log('Sending Message Error');
            }
        });
    };
};
