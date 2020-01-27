const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// solid-server
const solid = require('solid-server')
const Q = require('q')
const N3 = require('n3')
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

const rdfjsSource = require('./modules/rdfjsSource.js')
rdfjsSource.init(N3, Q)

const gestorS = require('./modules/gestorSOLID.js')
gestorS.init(app, Q, auth.fetch, newEngine, rdfjsSource, fileClient, namespaces)

require('./routes/writeRoutes.js')(app, gestorS)
require('./routes/routes.js')(app, gestorS, namespaces)

// running solid as express
app.use('/', solid({
  webid: true,
  sslCert: path.resolve('keys/cert.pem'),
  sslKey: path.resolve('keys/key.pem')
}))

app.listen(8443, function () {
  console.log('Starting server on port ' + 8443)
  console.log('Solid server is now running in /')
})
