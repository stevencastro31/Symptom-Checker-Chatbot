import IntentMatcher from "@libs/intent-matcher";
import axios from "axios";
import dotenv from 'dotenv';
import { LangaugeCode } from "enums/language_code";
import { structProtoToJson } from '@libs/structjson'
dotenv.config();

const EnglishIntentMatcher = new IntentMatcher(LangaugeCode.ENGLISH);
const FilipinoIntentMatcher = new IntentMatcher(LangaugeCode.TAGALOG);

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

        for (let i = 0; i < messages.length; i++) {
            const message: any = messages[i];
            const reply: any = {}

            if (message.message === 'text') {
                reply.text = message.text.text[0];
            } else {
                const payload: any = structProtoToJson(message.payload);
                reply.text = payload.text;
                reply.quick_replies = payload.quickReplies;
            }

			await axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${accessToken}`,
				{
					messaging_type: 'RESPONSE',
					recipient: {
						id: userId
					},
					message: reply,
				}).catch((error: any) => {
					console.log('Sending Message Error');
				});
        };
    };
};

export default ChatManager;
