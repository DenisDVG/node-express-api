const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("index", { title: "My Express app", message: "Start app" });
});

module.exports = router;
