const express = require("express");
const router = express.Router();
const Joi = require("joi");

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", function (req, res) {
  res.send(courses);
});

router.get("/:id", function (req, res) {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The cours not faund");
  }
  res.send(course);
});

router.post("/", function (req, res) {
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(404).send(error);
    return;
  }
  const course = { id: courses.length + 1, name: req.body.name };
  courses.push(course);
  res.send(course);
});

router.put("/:id", function (req, res) {
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

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}

router.delete("/:id", function (req, res) {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The cours not faund");
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

module.exports = router;
