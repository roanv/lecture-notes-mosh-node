const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const auth = require('../middleware/auth');

router.post('/',auth, async (req,res) => {
    const customerId = req.body.customerId;
    const movieId = req.body.movieId;

    if (!customerId) return res.status(400).send('Customer ID not provided.');
    if (!movieId) return res.status(400).send('Movie ID not provided.');

    const rental = await Rental.findOne({customerId,movieId});
    if(!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned) return res.status(400).send('Rental already processed');

    rental.dateReturned = new Date();
    await rental.save();
    res.status(200).send();
});

module.exports = router; 