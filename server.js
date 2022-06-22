const app = require('./app');
const config = require('config');
const DEFAULT_PORT = process.env.PORT || config.port || 0;

let server;

server = app.listen(DEFAULT_PORT, () => console.log(`Listening on port ${server.address().port}...`));

module.exports = server;