const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Genres API');
});

  module.exports = router; 