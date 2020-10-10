const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/api/courses", function (req, res) {
  res.send([1, 2, 3]);
});

app.get("/api/courses/:id", function (req, res) {
    res.send(req.params.id);
  });

const port = process.env.PORT || "3000";
app.listen(port, () => {
  console.log(`listen port ${port}`);
});
