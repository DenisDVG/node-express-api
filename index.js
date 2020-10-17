// console.log('');
// !!! conection to db and config it
const mongoose = require("mongoose");
// Configurations are stored in configuration files within your application, and can be 
// overridden and extended by environment variables, command line parameters, or external sources
const config = require('config');
// Helmet helps you secure your Express apps by setting various HTTP headers.
const helmet = require("helmet");
// not importent kind of debugger
const startupDebugger = require('debug')('app:startup');
// not importent kind of debugger
const dbDebugger = require('debug')('app:db');
// HTTP request logger middleware for node.js
const morgan = require('morgan');
const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const home = require("./routes/home");
const express = require("express");
// !!! Fast, unopinionated, minimalist web framework for node.
const app = express();
mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("mongodb mongo-exercises connect"))
  .catch((err) => console.error("error", err));

//  set pug  view engine
app.set('view engine', 'pug');
app.set('views', './views')

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`env: ${app.get('env')}`);
console.log('app config name'+ config.get('name'));
console.log('app config server'+ config.get('mail.host'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('morgan in development console.log');
  startupDebugger('morgan in development startupDebugger');
}

dbDebugger('Connected to the db');

app.use(logger);
app.use(function(req, res, next) {
  console.log('Authentication...');
  next();
});

const port = process.env.PORT || "3000";
// start server
app.listen(port, () => {
  console.log(`listen port ${port}`);
});