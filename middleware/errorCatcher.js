module.exports = function errorCatcher(handler){ // factory function
    return async (req,res,next) =>{ // that returns async middleware which can be called later
        try {
            await handler(req,res); // which in turn will then call the handler middleware
        }
        catch (ex){
            next(ex); // and catch any errors 
        }
    }    
}