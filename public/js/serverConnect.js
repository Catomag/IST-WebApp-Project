var id = "null";
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
  });
  return false;
}

function connectHost() {
  var questionInput = document.getElementById("questionInput");
  var url = "http://" + window.location.host + "/id/" + questionInput.value;
  window.location.replace(url);
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
    console.log("Pinged! " + time);
    time++;
  }
}, 800);

window.onbeforeunload = () => {
  clearInterval(heartbeat);
}
