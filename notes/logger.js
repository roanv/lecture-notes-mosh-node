// custom middleware
function log (req,res,next) {
    console.log("logging.."); 
    next(); // pass control to next in line
}

module.exports = log;