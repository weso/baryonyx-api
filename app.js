var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
//solid-server
var solid = require("solid-server");
//express application
var app = express();

//json and body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
routes(app);

// Starting solid server
var ldp = solid.createServer();
//server
ldp.listen(8080, function () {
  console.log("Starting server on port " + 8080);
  console.log("LDP will run on /");
})
