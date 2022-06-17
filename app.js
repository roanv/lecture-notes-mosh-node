const genres = require('./routes/genres');
const customers = require('./routes/customers');

const express = require('express');
const app = express();

require('./database').init();

require('./middleware').init(app);

require('./templating').init(app);

// ROUTES
app.use('/api/customers',customers);
app.use('/api/genres',genres);

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));