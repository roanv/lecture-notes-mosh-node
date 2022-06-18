const { default: mongoose } = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');

const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly')  // db created the first time something is written to it
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json())

// ROUTES
app.use('/api/customers',customers);
app.use('/api/genres',genres);
app.use('/api/movies',movies);

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));