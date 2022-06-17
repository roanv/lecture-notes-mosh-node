const genres = require('./routes/genres');
const customers = require('./routes/customers');
const mongoose = require('mongoose'); 
const express = require('express');
const app = express();

// DB CONNECT
mongoose.connect('mongodb://localhost/vidly')  // db created the first time something is written to it
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

// ROUTES
app.use(express.json())
app.get('/',(req, res) => {res.send('Vidly Home');})
app.use('/api/customers',customers);
app.use('/api/genres',genres);

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));