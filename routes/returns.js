const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const moment = require('moment');

router.post('/',auth, async (req,res) => {
    const customerId = req.body.customerId;
    const movieId = req.body.movieId;

    if (!customerId) return res.status(400).send('Customer ID not provided.');
    if (!movieId) return res.status(400).send('Movie ID not provided.');

    const rental = await Rental.findOne({customerId,movieId});
    if(!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned) return res.status(400).send('Rental already processed');

    rental.dateReturned = new Date();
    const days = moment.duration(rental.dateReturned - rental.dateOut, 'milliseconds').days();
    rental.rentalFee = rental.movie.dailyRentalRate * days;
    await rental.save();

    const movie = await Movie.findOne({id:movieId});
    movie.numberInStock += 1;
    movie.save();
    
    res.status(200).send(rental);
});

module.exports = router; 