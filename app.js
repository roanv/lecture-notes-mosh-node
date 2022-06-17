const genres = require('./routes/genres');
const customers = require('./routes/customers');
const mongoose = require('mongoose'); 
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db'); // second call is arbitrary namespace
const config = require('config'); 
const logger = require('./middleware/logger')  // custom middleware
const helmet = require('helmet'); // header protection
const morgan = require('morgan');  // logging http requests

const express = require('express');
const app = express();

app.set('view engine', 'pug'); // enable pug
app.set('views','./views'); // optional (this is default value)

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
    startupDebugger('morgan enabled...'); // looks at process.env.DEBUG == app:startup
    dbDebugger('connected to db');  // looks at process.env.DEBUG == app:db
    // can also set env variable to DEBUG=app:* to log all in app namespace
}

// CONFIGURATION
console.log('Application Name: ' + config.get('name')); // looks at NODE_ENV
console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('password')); // need to set $env:NODEPW_MOSH_EXPRESS="123"
// console.log(process.env.NODEPW_MOSH_EXPRESS); 
// to set env variable in powershell $env:NODEPW_MOSH_EXPRESS="123"
// sets variable for that powershell session

// ROUTES
app.get('/',(req, res) => {res.render('index',{title:'Vidly',message:'Welcome to Vidly!'});}) // pug render
app.use('/api/customers',customers);
app.use('/api/genres',genres);

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));