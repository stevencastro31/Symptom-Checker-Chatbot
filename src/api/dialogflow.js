const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json(['Dialogflow']);
});

// * Processes Dialogflow Fulfillment
router.post('/', (req, res) => {
    res.json(['Dialogflow']);
});

module.exports = router;