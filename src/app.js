const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
var Ddos = require('ddos');
var ddos = new Ddos({burst:10, limit:15})
require('dotenv').config();
 
const api = require('./api');
const auth = require('./api/auth');
var bodyParser = require('body-parser');
const app = express();
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Bearer, x-access-token");
  next();
});  
app.use(helmet()); 
app.use(ddos.express);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json('🦄');
});

app.use('/v1', api);
app.use('/v1/auth', auth);
 

module.exports = app;
