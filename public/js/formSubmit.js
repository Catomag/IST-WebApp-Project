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
  });
  return false;
}

function connectHost() {
  var questionInput = document.getElementById("questionInput");
  var url = "http://" + window.location.host + "/id/" + questionInput.value;
  window.location.replace(url);
}
