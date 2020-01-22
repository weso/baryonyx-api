var express = require('express')
var routes = require('./routes/routes.js')

// body parser
var bodyParser = require('body-parser')

// solid-server
var solid = require('solid-server')

// express application
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// routes
routes(app)

// running solid as express
app.use('/', solid())

app.listen(8080, function () {
  console.log('Starting server on port ' + 8080)
  console.log('Solid server is now running in /')
})
