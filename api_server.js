let express = require('express');
let app = express();
let fs = require('fs');
const http = require('http');

// load environment variables (or .env if local environment)
require('dotenv').config();

// For this: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
// (Not sure if we will need this or not? This may be needed for the database)
require('./Middleware/CORS.js')(app);

// load routes
require('./routes.js')(app);

// create the server and set it to listen
const httpServer = require('./config/ssl/ssl.js')(app);

httpServer.listen(
    process.env.APP_PORT,
    () => console.log(`Hey, we are listening on HTTPS port ${process.env.APP_PORT}`)
);
