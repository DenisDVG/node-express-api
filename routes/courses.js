const express = require("express");
const router = express.Router();
const Joi = require("joi");

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  _id: String,
  name: {type: String, required: true},
  author: String,
  tags: {type: Array,
  validate: {
    isAsync: true,
    validator: function(v, callback) {
      setTimeout(() => {
        const res = v && v.lenghth > 0
        callback(res);
      }, 4000);
    }
  }},
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() {return this.isPublished;}
  }
});

const Course = mongoose.model('Course', courseSchema);

async function getCourse() {
  const courses = await Course
  .find();
  // console.log(courses);
  return courses;
}


router.get("/", async function (req, res) {
  const courses = await getCourse();
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
