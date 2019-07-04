var id;
var gameid;
var time = 0;

function createHost() {
  var questionInput = document.getElementById("questionInput");

  var url = "http://" + window.location.host + "/create/" + questionInput.value;
  var data = {}
  var request = new Request(url, {
    method: 'POST',
    body: data,
    headers: new Headers()
  });

  fetch(request)
  .then((resp) => resp.json())
  .then((data) => {
    console.log("this ran");
    console.log(data);
    console.log("Host id is: " + data.id);
    id = data.id;
    document.getElementById("hostId").innerHTML = "Id is: " + id;
  });
  return false;
}

function connectToHost() {
  var questionInput = document.getElementById("questionInput");
  var url = "http://" + window.location.host + "/id/" + questionInput.value;
  var data = {};
  var request = new Request(url, {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  return fetch(request)
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
    return data;
  })
  .catch((error) => { console.warn(error) })
}

var heartbeat = setInterval(() => {
  if(id != "null") {
    var url = "http://" + window.location.host + "/hostPing/" + id;
    var data = {}
    var request = new Request(url, {
      method: 'POST',
      body: data,
      headers: new Headers()
    });
    fetch(request);
    time++;
  }
}, 800);

window.onbeforeunload = () => {
  clearInterval(heartbeat);
}

async function animateJoin(floater, text, input, inputBar) {
  var data = JSON.parse(POST("http://" + window.location.host + "/id/" + questionInput.value));
  console.log(data);
  if(data != null) {
    height(floater, 0, .4);
    text.classList.remove("sideToSide");
    scale(text, 0, .2);
    height(text, 0, 1);
    //await sleep(200);
    width(input, 80, .5);
    inputBar.value = data.question + '?';
    inputBar.setAttribute("readonly", "");
  }
}
