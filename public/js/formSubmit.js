var questionInput = document.getElementById("questionInput");

function sendToServer() {
  console.log("text input " + questionInput.value);
  var url = window.location.host + "/create/" + questionInput.value;
  var request = new Request(url, {
    method: 'POST',
    body: data,
    headers: new Headers()
  });

  fetch(request)
  .then((data) => {
    console.log("this ran");
    console.log(data.id);
    document.getElementById("idThing").value = data.id;
  });
  return false;
}
