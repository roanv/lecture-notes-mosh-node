function log (req,res,next) {
    console.log("logging.."); // custom middleware
    next(); // pass control to next in line
}

module.exports = log;