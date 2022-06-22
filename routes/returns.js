const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const moment = require('moment');
const Joi = require('joi');
const validate = require('../middleware/validate');

router.post('/',[auth, validate(validateReturn)], async (req,res) => {
    const rental = await Rental.lookup(req.body.customerId,req.body.movieId);    

    if(!rental) return res.status(404).send('Rental not found.');
    if (rental.dateReturned) return res.status(400).send('Rental already processed');

    rental.return();
    await rental.save();

    const movie = await Movie.findOne({id:rental.movie.movieId});
    movie.numberInStock += 1;

    
    await movie.save();
    
    res.status(200).send(rental);
});

function validateReturn(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });
    return schema.validate(rental);
}


module.exports = router; 