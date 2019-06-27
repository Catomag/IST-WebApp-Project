//Dependencies
const express = require("express");
const path = require("path");
const port = 3000;
var address;

//Sets up the server and prints connection info
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static("public"));

app.listen(port, '', () => {
  console.log("Port: " + port);
});

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  address = add;
  console.log('Address: ' + add);
  console.log('Link: ' + address + ":" + port);
})


//Host variables

class hostTemplate {
  constructor(question) {
    this.id = "";
    this.question = question;
    this.playerCount = 0;
    this.lastupdate = 0;
    this.votes = [];
  }
}

class playerTemplate {
  constructor(gameid, playerid) {
    this.gameid = gameid;
    this.playerid = playerid;
    this.lastupdate = 0;
  }
}

var hosts = [];
var players = [];


//Heartbeat to check periodically whether players are connected or not
setInterval(() => {
  for (var i = 0; i < players.length; i++) {
    if(players[i].lastupdate > 2) {
      players.splice(i, 1);
    }
    else {
      players[i].lastupdate++;
    }
  }

  for (var i = 0; i < hosts.length; i++) {
    if(hosts[i].lastupdate > 2) {
      console.log("Removed host " + JSON.stringify(hosts[i]));
      hosts.splice(i, 1);
    }
    else {
      hosts[i].lastupdate++;
    }
  }
}, 500);


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
      return;
    }
  }
  console.log("Id not found");
  res.send("null");
});


//Post requests (Hidden requests)

//Creates a new game and returns id
app.post("/create/:question/", (req, res) => {
  var newHost = new hostTemplate(req.params.question);
  newHost.id = makeid(5);
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

//Gets ping from server so its still active
app.post('/hostPing/:id/', (req, res) => {
  var id = req.params.id;
  for(var i = 0; i < hosts.length; i++) {
    if(hosts[i].id == id) {
      hosts[i].lastupdate = 0;
      console.log("Host: " + id + " just pinged!");
      res.json(hosts[i]);
      return;
    }
  }
  res.send("null");
});

//Gets ping from server so its still active
app.post('/playerPing/:id/', (req, res) => {
  var id = req.params.id;
  for(var i = 0; i < hosts.length; i++) {
    if(players[i].id == id) {
      players[i].lastupdate = 0;
      console.log("Player: " + id + " just pinged!");
      res.json(players[i]);
      return;
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
