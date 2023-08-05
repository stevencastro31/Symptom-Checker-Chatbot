const express = require('express');

const router = express.Router();

const ChatManager = require('../../public/model/chat-manager');
const MessengerChatManager = new ChatManager();

// * Verifies new webhook URLs set in the Meta App Dashboard 
router.get('/', async (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        console.log('> Verifying Webhook');
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.log('> Verifying Webhook Failed');
        res.sendStatus(403);
    }
});

// * Captures user messages sent through Messenger
router.post('/', async (req, res) => {
    const body = req.body;

    if (body.object === 'page') {    
        try {
            const entry = body.entry[0];
            const messaging = entry.messaging;

            messaging.forEach(async (message) => {
                const senderId = message.sender.id;
                const messageText = message.message.text;

                console.log('1');
                const response = await MessengerChatManager.readMessage(senderId, messageText)
                const fulfillmentMessages = response[0].queryResult.fulfillmentMessages;
                console.log('2');
                console.log(fulfillmentMessages);

                await MessengerChatManager.sendMessage(senderId, fulfillmentMessages);
                console.log('3');
            });
        } catch (exception) {
            console.log('Message Error');
        }
        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;