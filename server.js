//Arquetipo
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const logger = require('./app/core/logger');
const config = require('./app/core/config')

//solid
const Q = require('q')
const auth = require('solid-auth-client')
const newEngine = require('@comunica/actor-init-sparql-rdfjs').newEngine

// solid file client
const authCLI = require('solid-auth-cli')
const FC = require('solid-file-client')
const fileClient = new FC(authCLI)

// namespaces
const namespaces = require('prefix-ns').asMap()

// express application
const app = express()
app.use(morgan('common'));
app.use(helmet());
app.use(compression());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const gestorS = require('./app/modules/gestorSOLID.js')
gestorS.init(app, Q, auth.fetch, newEngine, fileClient, namespaces)

let url = config.url
// Routes registering
require('./app/routes/health.js')(app)

require('./app/routes/writeRoutes.js')(app, gestorS, url)
require('./app/routes/deleteRoutes.js')(app, gestorS, url)
require('./app/routes/readRoutes.js')(app, gestorS, namespaces, url, fileClient)

// Middleware for result codes management
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'});
});

app.listen(config.port);

logger.info('Server started on port: ', config.port);

module.exports = app
