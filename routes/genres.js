const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Genres API');
  });

  module.exports = router; 