const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
    const dbPath = config.get('db');
    mongoose.connect(dbPath)  // db created the first time something is written to it
    .then(() => winston.info(`Connected to ${dbPath}...`));
}