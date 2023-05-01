let express = require('express');
let app = express();
let fs = require('fs');
const http = require('http');
const Soren = require('./api_interface/API_Interface.js');
const api = new Soren();

let trackPathsPromise;
async function getResponse() {
    const apple = await api.getTrackPaths().then(t => t);
    return apple.data;
}
trackPathsPromise = getResponse();
console.log(trackPathsPromise);

    /*
    .then(trackPaths => trackPaths.data)
    .catch(error => (
    {
        error,
        trackPaths: undefined,
    }));
    */

// load environment variables (or .env if local environment)
require('dotenv').config();

// For this: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
// (Not sure if we will need this or not? This may be needed for the database)
require('./Middleware/CORS.js')(app);

// load routes
require('./routes.js')(app, trackPathsPromise);

// create the server and set it to listen
const httpServer = require('./config/ssl/ssl.js')(app);

httpServer.listen(
    process.env.APP_PORT,
    () => console.log(`Hey, we are listening on HTTPS port ${process.env.APP_PORT}`)
);
