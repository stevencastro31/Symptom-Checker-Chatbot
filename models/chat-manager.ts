import IntentMatcher from "@libs/intent-matcher";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const EnglishIntentMatcher = new IntentMatcher('en');
const FilipinoIntentMatcher = new IntentMatcher('tl');

class ChatManager { 
    type: string;

    constructor() {
    	this.type = 'default';
    };

    // TODO: Implement language switch w/ knowledge base
    async readMessage(userId: string, message: string) {
        return EnglishIntentMatcher.detectIntent(userId, message);
    };

    async sendMessage(userId: string, messages: Object[]) {
        const accessToken = process.env.PAGE_ACCESS_TOKEN;
        messages.forEach(async (message: any) => {
            const text = message.text.text[0];
			axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${accessToken}`,
				{
					messaging_type: 'RESPONSE',
					recipient: {
						id: userId
					},
					message: {
						text: text
					}
				}).catch((error: any) => {
					console.log('Sending Message Error');
				});
        });
    };
};

export default ChatManager;
