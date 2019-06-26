function sendToServer() {
  var questionInput = document.getElementById("questionInput");
  var url = "http://" + window.location.host + "/create/" + questionInput.value;
  var data = {}
  var request = new Request(url, {
    method: 'POST',
    body: data,
    headers: new Headers()
  });

  fetch(request)
  .then((data) => {
    console.log("this ran");
    console.log("Host id is: " + data);
    document.getElementById("idThing").value = data.id;
  });
  return false;
}
