require('express-async-errors');
const { default: mongoose } = require('mongoose');
const config = require('config');
const winston = require('winston'); // logging errors
require('winston-mongodb');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const sampleGen = require('./models/sampleDataGenerator');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const express = require('express');
const app = express();

winston.add(new winston.transports.File({filename:'./logs/application.log'}));
winston.add(new winston.transports.MongoDB({db:'mongodb://localhost/vidly'}));

if (!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    // to set env variable key in powershell: $env:vidly_jwtPrivateKey="example key" 
    process.exit(1);
}

initDatabase();

app.use(express.json())

// ROUTES
app.use('/api/customers',customers);
app.use('/api/genres',genres);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);
app.use('/api/users', users);
app.use('/api/auth',auth);
app.use(error); // exceptions need to be AFTER other middleware

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));


async function initDatabase(){
    await mongoose.connect('mongodb://localhost/vidly')  // db created the first time something is written to it
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));
    
    sampleGen.customers();
    sampleGen.genres();
    sampleGen.movies();
    sampleGen.rentals();
}