//Dependencies
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');

const port = 3000;
const idLength = 4;
const playerIdLength = 20;
var address;

//Sets up the server and prints connection info
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static("public"));
app.use(bodyParser.json());

app.listen(port, '', () => {
  console.log("Port: \x1b[33m" + port + "\x1b[0m");
});

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  address = add;
  console.log('Link: ' + "\x1b[33m" + address + ":" + port + "\x1b[0m");
});


//Host variables

class Host {
  constructor(question) {
    this.id = "";
    this.question = question;
    this.playerCount = 0;
    this.lastupdate = 0;
    this.votes = [];
    this.players = [];
  }
}

class Player {
  constructor(id) {
    this.id = id;
    this.vote = null;
    this.lastupdate = 0;
  }
}

var hosts = [];

//Heartbeat to check periodically whether players are connected or not
setInterval(() => {
  /*for (var i = 0; i < players.length; i++) {
    if(players[i].lastupdate > 2) {
      players.splice(i, 1);
    }
    else {
      players[i].lastupdate++;
    }
  }*/

  for (var i = 0; i < hosts.length; i++) {
    if(hosts[i].lastupdate > 2) {
      console.log("Removed host " + JSON.stringify(hosts[i]));
      hosts.splice(i, 1);
    }
    else {
      hosts[i].lastupdate++;
    }
  }
}, 600);


//----------------------------------------------------------------------------------------------------------------------


//Standard response
app.get("/", (req, res) => {
  res.render("join");
});


//----------------------------------------------------------------------------------------------------------------------


//Question creator
app.get("/create/", (req, res) => {
  res.render("question");
});


//----------------------------------------------------------------------------------------------------------------------


//Redirect to game
app.get("/id/:id/", (req, res) => {
  var id = req.params.id;
  res.type('text/plain');
  console.log("Recieved request for id: " + id);
  for(var i = 0; i < hosts.length; i++) {
    if(hosts[i].id == id) {
      console.log("Id found");
      res.json(hosts[i]);
      return;
    }
  }
  console.log("Id not found");
  res.json(null);
});


//----------------------------------------------------------------------------------------------------------------------


//Creates a new game and returns info
app.post("/create/:question/", (req, res) => {
  var newHost = new Host(req.params.question);
  newHost.id = getUniqueHostId();
  hosts.push(newHost);
  console.log("Question: " + newHost.id + " created");
  res.json(newHost);
});


//----------------------------------------------------------------------------------------------------------------------


//Creates a new player and returns info
app.post("/createPlayer/:id/", (req, res) => {
  var id = req.params.id;
  host = getHost(id);

  if(host != null) {
    var player = new Player(makeid(playerIdLength));
    host.players.push(player);
    res.json(player);
    return;
  }

  res.json(null);
});


//----------------------------------------------------------------------------------------------------------------------


app.post("/updatePlayer/:gameid/", (req, res) => {
  var gameid = req.params.gameid;
  var player = req.body;
  var host = getHost(gameid);
  for (var i = 0; i < host.players.length; i++) {
    if(host.players[i] == player) {
      console.log("Player updated");
      host.players[i] = player;
      res.json(host.players[i]);
      return;
    }
  }
  res.json(null);
});


//----------------------------------------------------------------------------------------------------------------------


app.post("/removePlayer/:id/", (req, res) => {
  var gameid = req.params.gameid;
  var player = req.body;
  var host = getHost(gameid);
  for (var i = 0; i < host.players.length; i++) {
    if(host.players[i] == player) {
      host.splice(i, 1);
      return;
    }
  }
});


//----------------------------------------------------------------------------------------------------------------------


//Gets info from existing id
app.post("/id/:id/", (req, res) => {
  var id = req.params.id;
  for(var i = 0; i < hosts.length; i++) {
    if(hosts[i].id == id) {
      res.json(hosts[i]);
      return;
    }
  }

  res.json(null);
});


//----------------------------------------------------------------------------------------------------------------------


//If no id is provided return null (Fixed an issue I had)
app.post("/id/", (req, res) => {
  res.json(null);
});


//----------------------------------------------------------------------------------------------------------------------


//Gets ping from server so its still active
app.post('/hostPing/:id/', (req, res) => {
  var id = req.params.id;
  var host = hosts[getHostIndex(id)];
  if(host != null) {
    host.lastupdate = 0;
    res.json(host);
    return;
  }
  res.json(null);
});


//----------------------------------------------------------------------------------------------------------------------


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
  res.json(null);
});


//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------


//Helper functions

//Makes an id
function makeid(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//Makes a simplified id
function makesimpleid(length) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function isUniqueHostId(id) {
  for (var i = 0; i < hosts.length; i++) {
    if(hosts[i] == id) {
      return false;
    }
  }

  return true;
}

function getUniqueHostId() {
  var id = makesimpleid(idLength);
  while(!isUniqueHostId(id)) {
    id = makesimpleid(idLength);
  }
  return id;
}

function getHost(id) {
  for (var i = 0; i < hosts.length; i++) {
    if(hosts[i].id == id) {
      return hosts[i];
    }
  }
}

function getHostIndex(id) {
  for (var i = 0; i < hosts.length; i++) {
    if(hosts[i].id == id) {
      return i;
    }
  }
}

function getPlayer(gameid, id) {
  var host = getHost(gameid);
  for (var i = 0; i < host.players.length; i++) {
    if(host.players[i].id == id) {
      return host.players[i];
    }
  }
}
