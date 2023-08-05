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

                const response = MessengerChatManager.readMessage(senderId, messageText).then((response) => {
                    console.log('MESSAGE READ');
                    console.log(response);

                    const fulfillmentMessages = response[0].queryResult.fulfillmentMessages;
                    MessengerChatManager.sendMessage(senderId, fulfillmentMessages).then((response) => {
                        console.log('MESSAGE SENT');
                        console.log(response);
                    }).catch((error) => {
                        console.log('MESSAGE NOT SENT');
                        console.log(error);
                    });

                }).catch((error) => {
                    console.log('MESSAGE NOT READ');
                    console.log(error);
                });
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