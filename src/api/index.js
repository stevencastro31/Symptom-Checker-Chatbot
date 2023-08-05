const express = require('express');

const dialogflow = require('./dialogflow');
const messenger = require('./messenger');

const router = express.Router();

router.get('/', (req, res) => {
    res.json(['Webhook']);
});

router.use('/dialogflow', dialogflow);
router.use('/messenger', messenger);

module.exports = router;
