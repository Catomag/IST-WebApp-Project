function append(parent, elem) {
  return parent.append(elem);
}

function createNode(elem) {
  return document.createElement(elem);
}

function gId(id) {
  return document.getElementById(id);
}

function gClass(name) {
  return document.getElementsByClassName(name);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function GET(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false);
  xmlHttp.send(null);
  return xmlHttp.response;
}

function POST(url) {
  var error = false;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onerror = () => {
    error = true;
    console.log("There was an error");
  }
  xmlHttp.open("POST", url, false);
  xmlHttp.send(null);

  /*if(xmlHttp.response == "null") {
    console.log("Oh no! there was an error on this post request");
    return null;
  }*/

  return xmlHttp.response;
}

function POSTINFO(url, message) {
  var error = false;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onerror = () => {
    error = true;
    console.log("There was an error");
  }
  xmlHttp.open("POST", url, false);
  xmlHttp.send(message);
  if(error) {
    return null;
  }

  return xmlHttp.response;
}
