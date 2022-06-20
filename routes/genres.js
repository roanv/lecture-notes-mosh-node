const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const errorCatcher = require('../middleware/errorCatcher')

// router.get('/', (req,res) => {
//     const genres = await Genre.find().sort('name');
//     res.send(genres);
// });

const handler = async function (req, res, next) {
    const genres = await Genre.find().sort('name');
    res.send(genres);
}

router.get('/', errorCatcher(handler)); // just example of whats happening, use express-async-errors package
// error catcher is factory that returns middleware
// this middleware acts as a wrapper around the handler to catch errors it may throw

router.post('/', auth, async (req, res) => { // auth passed in as middleware to be executed before this route
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let genre = new Genre({ name: req.body.name });
    await genre.save();
    
    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
      new: true
    });
  
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    
    res.send(genre);
});

router.delete('/:id', [auth,admin] , async (req, res) => { // auth and admin middleware run first
    const genre = await Genre.findByIdAndRemove(req.params.id);
  
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
  
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
});

module.exports = router; 