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
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
  return xmlHttp.response;
}

function POST(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", url, false);
  xmlHttp.send(null);
  return xmlHttp.response;
}
