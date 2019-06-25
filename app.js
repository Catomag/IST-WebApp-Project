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
  });
});

app.get("/:username/", (req, res) => {
  var username = req.params.username;

  res.render("index.pug", {
    username: username,
  });
});
