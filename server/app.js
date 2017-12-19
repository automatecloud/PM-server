const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bootstrap = require("./helpers/bootstrap").bootstrap;

const app = express();

// Signing morgan logger

/////////////////////
// configurations //
///////////////////

// morgan logger
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// Connect to db
mongoose.connect('mongodb://127.0.0.1:27017/refactor', {
    useMongoClient: true
}).then(() => {
    console.log(`Succesfully Connected to the Mongodb Database  at URL : mongodb://127.0.0.1:27017/refactor`);
}).catch(() => {
    console.log(`Error Connecting to the Mongodb`);
});
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


//////////////////////
/////// routes //////
////////////////////

// api references
const mapsApi = require("./api/routes/maps.routes");
const pluginsApi = require("./api/routes/plugins.routes");
const agentsApi = require("./api/routes/agents.routes");
const projectsApi = require("./api/routes/projects.routes");

app.use('/api/maps', mapsApi);
app.use('/api/plugins', pluginsApi);
app.use('/api/agents', agentsApi);
app.use('/api/projects', projectsApi);

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Running on localhost:${port}`);
    bootstrap(app);
});
