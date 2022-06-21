const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect('mongodb://localhost/vidly')  // db created the first time something is written to it
    .then(() => winston.info('Connected to MongoDB...'));
}