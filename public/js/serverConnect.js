var id = "null";
var lastQuestion = "";
var time = 0;

function createHost() {
  var questionInput = document.getElementById("questionInput");

  if(id == "null" || questionInput .value != lastQuestion) {
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
  }
  lastQuestion = questionInput.value;
  return false;
}

function connectHost() {
  var questionInput = document.getElementById("questionInput");
  var url = "http://" + window.location.host + "/id/" + questionInput.value;
  window.location.href = url;
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
