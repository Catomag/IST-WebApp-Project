//Dependencies
const express = require("express");
const path = require("path");
const port = 3000;
var address;

//Sets up the server
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static("public"));

var server = app.listen(port, 'localhost', () => {
  console.log("Server listening on port: " + port + " and address: " + server.address().address);
  address = server.address().address;
});


//Host variables

class hostTemplate {
  constructor(question) {
    this.id = "";
    this.question = question;
    this.playerCount = 0;
    this.votes = [];
  }
}

var hosts = [];


//Get requests (Requests visible in the url)

//Standard response
app.get("/", (req, res) => {
  res.render("join");
});

//
app.get("/create/", (req, res) => {
  res.render("question");
});

//Redirect to game
app.get("/id/:id/", (req, res) => {
  var id = req.params.id;
  res.type('text/plain');
  console.log("Recieved request for id: " + id);
  for(var i = 0; i < hosts.length; i++) {
    console.log("Comparing " + id + " with " + hosts[i].id);
    if(hosts[i].id == id) {
      console.log("Id found");
      res.send(JSON.stringify(hosts[i]));
    }
  }
  console.log("Id not found");
  res.send("null");
});


//Post requests (Hidden requests)

//Creates a new game and returns id
app.post("/create/:question/", (req, res) => {
  var newHost = new hostTemplate(req.params.question);
  newHost.id = makeid(12);
  /*var votes = JSON.parse(req.params.votes);
  for (var i = 0; i < votes.length; i++) {
    temp.votes.push(votes[i]);
  }*/
  hosts.push(newHost);
  res.json(newHost);
});

//Gets info from existing id~
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
