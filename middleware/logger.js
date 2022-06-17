function log (req,res,next) {
    console.log("logging.."); // custom middleware
    next(); // pass control to next middleware
}

module.exports = log;