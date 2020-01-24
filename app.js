var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
// solid-server
var solid = require('solid-server')
// routes
var routes = require('./routes/routes.js')

// express application
var app = express()

// routes
routes(app)

app.use(bodyParser.json())

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
