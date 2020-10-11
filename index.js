// console.log('');
const helmet = require("helmet");
var morgan = require('morgan');
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const app = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`env: ${app.get('env')}`);


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('morgan in development');
}

app.use(logger);
app.use(function(req, res, next) {
  console.log('Authentication...');
  next();
});

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", function (req, res) {
  res.send(courses);
});

app.get("/api/courses", function (req, res) {
  res.send(courses);
});

app.get("/api/courses/:id", function (req, res) {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The cours not faund");
  }
  res.send(course);
});

app.post("/api/courses", function (req, res) {
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(404).send(error);
    return;
  }
  const course = { id: courses.length + 1, name: req.body.name };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", function (req, res) {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The cours not faund");
    return;
  }
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(404).send(error);
    return;
  }
  course.name = req.body.name;
  res.send(course);
});

app.get("/api/post/:year/:month", function (req, res) {
  res.send(req.query);
});

const port = process.env.PORT || "3000";
app.listen(port, () => {
  console.log(`listen port ${port}`);
});

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

app.delete("/api/courses/:id", function (req, res) {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The cours not faund");
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});