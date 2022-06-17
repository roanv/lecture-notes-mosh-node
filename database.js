const mongoose = require('mongoose'); 

//  mongo import from json cmd
//  mongoimport --db database-name --collection collection-name --file C:/path/to/data.json --jsonArray

function init(){
    mongoose.connect('mongodb://localhost/vidly')  // db created the first time something is written to it
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));
}

exports.init = init;