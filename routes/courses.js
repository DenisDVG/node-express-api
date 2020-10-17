// console.log('');
const express = require("express");
const router = express.Router();
// validate date
const Joi = require("joi");
// db conection
const mongoose = require("mongoose");
// validate db data
const courseSchema = new mongoose.Schema({
  _id: String,
  name: {type: String, required: true},
  author: String,
  tags: Array,
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() {return this.isPublished;}
  }
});

const Course = mongoose.model('Course', courseSchema);

router.get("/", async function (req, res) {
  const courses = await getCourses();
  res.send(courses);
});

router.get("/:id", async function (req, res) {
  const course = await getCourseById(req.params.id);
  if (!course) {
    res.status(404).send("The cours not faund");
    return;
  }
  res.send(course);
});

router.post("/", async function (req, res) {
  const { error } = validateCourse(req.body);
  if (error) {
    res.status(404).send(error);
    return;
  }

  const course = new Course({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    author: "Den",
    tags: ['web','back'],
    isPublished: true,
    price: 13
  });
  try {
    course.validate((err) => {
      if (err) {
        console.log('course.validate((err');
        return;
      }
    })
  }
  catch {
    console.log('catch course.validate((err catch');
    return;
  }
  const result = await course.save();
  // console.log(result); 
  res.send(result);
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

router.delete("/:id", function (req, res) {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The cours not faund");
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

async function getCourses() {
  const courses = await Course
  .find();
  // console.log(courses);
  return courses;
}

async function getCourseById(id) {
  const course = await Course.findById(id);
  return course;
}

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(course, schema);
}



module.exports = router;
