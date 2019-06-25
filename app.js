//Dependencies
const express = require("express");
const path = require("path");
const port = 3000;


//Sets up the server
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static("public"));

app.listen(port, () => {
  console.log("Server listening on port " + port);
});


//Host variables

var hostTemplate = {
  id: "",
  question: "",
  playerCount: 0,
  votes: []
}

var hosts = [];


//Get requests (Requests visible in the url)

//Standard response
app.get("/", (req, res) => {
  res.render("index.pug");
});

app.get("/:id/", (req, res) => {

});


//Post requests (Hidden requests)

//Creates a new game and returns id
app.post("/create/:question/", (req, res) => {
  var temp = new hostTemplate;
  temp.question = req.params.question;
  temp.id = makeid(12);
  /*var votes = JSON.parse(req.params.votes);
  for (var i = 0; i < votes.length; i++) {
    temp.votes.push(votes[i]);
  }*/
  res.send(temp.id);
});

//Gets info from existing id
app.post("/id/:id/", (req, res) => {
  var id = req.params.id;
  for(var i = 0; i < hosts.length; i++) {
    if(hosts[i].id == id) {
      res.send(JSON.stringify(hosts[i]));
    }
  }
  res.send("null");
});


//Helper functions

function makeid(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
