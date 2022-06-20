const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req,res,next){
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try{
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        req.user = decoded; // sets decoded properties on req payload
        // now you can use req.user.id etc
        next();
    }
    catch (ex){
        res.status(400).send('Invalid token.');
        // not calling next // terminate req res lifecycle with error
    }
    
}  