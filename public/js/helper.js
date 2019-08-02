var parser = new DOMParser();

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

function POST(url, result) {
  var error = false;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onerror = () => {
    error = true;
    console.log("There was an error");
  }
  xmlHttp.open("POST", url, true);
  xmlHttp.send();

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == XMLHttpRequest.DONE) {
      result.value = xmlHttp.response;
    }
  }
}

function POSTJSON(url, message, result) {
  var error = false;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onerror = () => {
    error = true;
    console.log("There was an error");
  }
  xmlHttp.open("POST", url, true);
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.send(JSON.stringify(message));

  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == XMLHttpRequest.DONE) {
      result.value = xmlHttp.response;
    }
  }
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}
