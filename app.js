const genres = require('./routes/genres');
const customers = require('./routes/customers');
const mongoose = require('mongoose'); 
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const logger = require('./middleware/logger')  // custom middleware
const helmet = require('helmet'); 
const morgan = require('morgan'); 


const express = require('express');
const app = express();

// DB CONNECT
mongoose.connect('mongodb://localhost/vidly')  // db created the first time something is written to it
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

//  mongo import from json cmd
//  mongoimport --db database-name --collection collection-name --file C:/path/to/data.json --jsonArray

// MIDDLEWARE
app.use(express.json()) // parsing json - creates json 'body' object on req
// below: parsing html form => json // key=value&key=value // sets body on json
//app.use(express.urlencoded({extended:true})); 
app.use(express.static('public')); // serve static pages in public folder
app.use(logger);
app.use(helmet()); // header security

// console.log(process.env.NODE_ENV);
// app.get('env') similar to process.env.NODE_ENV; returns development by default
if (app.get('env') === 'development'){  
    app.use(morgan('tiny')); // HTTP request logger 
    //console.log('morgan enabled...');
    startupDebugger('morgan enabled...'); // looks at process.env.DEBUG = app:startup
    dbDebugger('connected to db');  // looks at process.env.DEBUG = app:db OR DEBUG=app:*
}


// ROUTES
app.get('/',(req, res) => {res.send('Vidly Home');})
app.use('/api/customers',customers);
app.use('/api/genres',genres);

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));