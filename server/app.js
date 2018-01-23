const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bootstrap = require("./helpers/bootstrap").bootstrap;
const socket = require('socket.io');
const env = require('./env/enviroment');
const app = express();

/////////////////////
// configurations //
///////////////////

// morgan logger
app.use(morgan('dev'));


// enable cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


const server = http.createServer(app);
io = socket(server);
io.on('connection', function (socket) {
    console.log('a user connected');
});


let dbconfig;
try {
    dbconfig = require("./env/dbconfig");
} catch (e) {
    dbconfig = null;
}

if (dbconfig) {
    if (dbconfig.username && dbconfig.password) {
        connectionString = `mongodb://${dbconfig.username}:${dbconfig.password}@${dbconfig.url}:${dbconfig.port}/${dbconfig.name}`;
    } else {
        connectionString = `mongodb://${dbconfig.url}:${dbconfig.port}/${dbconfig.name}`;
    }

    mongoose.connect((dbconfig.uri || connectionString), {
        useMongoClient: true
    }).then(() => {
        console.log(`Succesfully Connected to the Mongodb Database`);
    }).catch((error) => {
        return res.status(500).send((error || `Error Connecting to the Mongodb`));
    });
}

mongoose.Promise = require('bluebird');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    req.io = io;
    next();
});

// Angular dist output folder
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/plugins', express.static(path.join(__dirname, 'libs', 'plugins')));
app.use('/media', express.static(path.join(__dirname, 'media_cdn')));


//////////////////////
/////// routes //////
////////////////////

/* api references */
const setupApi = require("./api/routes/setup.routes");
const mapsApi = require("./api/routes/maps.routes");
const pluginsApi = require("./api/routes/plugins.routes");
const agentsApi = require("./api/routes/agents.routes");
const projectsApi = require("./api/routes/projects.routes");

app.use('/api/setup', setupApi);
app.use('/api/maps', mapsApi);
app.use('/api/plugins', pluginsApi);
app.use('/api/agents', agentsApi);
app.use('/api/projects', projectsApi);


// Send all other requests to the Angular app
app.all('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);
app.io = io;

server.listen(port, () => {
    console.log(`Running on localhost:${port}`);
    bootstrap(app);
});



