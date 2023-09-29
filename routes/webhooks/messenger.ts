import express, { Request, Response, Router } from 'express';
import ChatManager from '@libs/chat-manager';

const router: Router = express.Router();
const MessengerChatManager = new ChatManager();

// * Verifies new webhook URLs set in the Meta App Dashboard 
router.get('/webhook/ms', async (req: Request, res: Response) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        console.log('> Verifying Webhook');
            res.status(200).send(req.query['hub.challenge']);
        } else {
            console.log('> Verifying Webhook Failed');
            res.sendStatus(403);
        }
});

// * Captures user messages sent through Messenger
router.post('/webhook/ms', async (req: Request, res: Response) => {
    const body = req.body;
    if (body.object === 'page') {
        try {
            const entry = body.entry[0];
            const messaging: Object[] = entry.messaging;

            messaging.forEach(async (message: any) => {
                const senderId = message.sender.id;
                const messageText = message.message.text;

                const response = await MessengerChatManager.readMessage(senderId, messageText);
                const fulfillmentMessages = response[0].queryResult.fulfillmentMessages;

                await MessengerChatManager.sendMessage(senderId, fulfillmentMessages);
            });
        } catch (exception) {
            console.log('Message Error');
        }
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);   
    }
});

export default router;
