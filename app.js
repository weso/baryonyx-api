const express = require('express')
const bodyParser = require('body-parser')

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

app.use(bodyParser.json())

const gestorS = require('./modules/gestorSOLID.js')
gestorS.init(app, Q, auth.fetch, newEngine, fileClient, namespaces)

let url = 'https://localhost:8440/symmetry/'
require('./routes/writeRoutes.js')(app, gestorS, url)
require('./routes/deleteRoutes.js')(app, gestorS, url)
require('./routes/readRoutes.js')(app, gestorS, namespaces, url, fileClient)

app.listen(8440, function () {
  console.log('Starting API on port ' + 8440)
})

module.exports = app
