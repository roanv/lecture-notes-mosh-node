const mongoose = require('mongoose'); 
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly')  // db created the first time something is written to it
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.get('/', (req,res) => {
    res.send('test')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));