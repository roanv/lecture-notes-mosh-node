const winston = require('winston');

module.exports = function(err,req,res,next){
    winston.error(err.message, {metadata:err});

    // LOGGING LEVELS  // cascades up eg. if "info", everything above "info" will also be logged
    // error 
    // warn
    // info
    // verbose
    // debug
    // silly
    
    res.status(500).send('Something went wrong.');
}