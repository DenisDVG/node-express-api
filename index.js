// console.log('');
const config = require('config');
const helmet = require("helmet");
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const home = require("./routes/home");
const express = require("express");
const app = express();

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
app.listen(port, () => {
  console.log(`listen port ${port}`);
});