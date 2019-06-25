const express = require("express");
const path = require("path");
const port = 3000;

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static("public"));

app.listen(port, () => {
  console.log("Server listening on port " + port);
});

app.get("/", (req, res) => {
  res.render("index.pug", {
    username: "default",
    password: "password"
  });
});

app.get("/:username/", (req, res) => {
  var username = req.params.username;

  res.render("index.pug", {
    username: username,
    password: "password"
  });m
});

app.get("/:username/:password/", (req, res) => {
  var username = req.params.username;
  var password = req.params.password;

  res.render("index.pug", {
    username: username,
    password: password
  });
});
