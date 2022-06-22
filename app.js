const express = require('express');
const app = express();
const config = require('config');

//require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

const PORT = config.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
module.exports = server;