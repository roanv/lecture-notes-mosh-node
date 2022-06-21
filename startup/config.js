const config = require('config');

module.exports = function () {
    if (!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
        // to set env variable key in powershell: $env:vidly_jwtPrivateKey="example key" 
    }
    
}