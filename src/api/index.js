const express = require('express');

const emojis = require('./emojis');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.get('/hotdog', (req, res) => {
  res.json({
    message: 'API - HOTDOG',
  });
});

router.use('/emojis', emojis);

module.exports = router;
