const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db'); // second call is arbitrary namespace
const config = require('config'); 
const helmet = require('helmet'); // header protection
const morgan = require('morgan');  // logging http requests
const logger = require('./middleware/logger')  // custom middleware
const express = require('express');


function init(app){
    app.use(helmet()); // header security
    app.use(express.json()) // parsing json - creates json 'body' object on req
}

function other(app){   
    // below: parsing html form => json // key=value&key=value // sets body on json
    //app.use(express.urlencoded({extended:true})); 

    app.use(logger);

    app.use(express.static('public')); // serve static pages in public folder

    
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
}

exports.init = init;