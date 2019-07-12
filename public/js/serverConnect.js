var info = {};
var time = 0;
var id;

if(isPlayer) {
  var ping = setInterval(() => {
    if(info.id != null) {
      var url = "http://" + window.location.host + "/playerPing/" + info.id;
      POST(url);
      time++;
    }
  }, 800);
}
else {
  //hostPing
  var ping = setInterval(() => {
    if(info.id != null) {
      var url = "http://" + window.location.host + "/hostPing/" + info.id;
      POST(url);
      console.log("Pinged server!");
      time++;
    }
  }, 800);
}


//----------------------------------------------------------------------------------------------------------------------


window.onbeforeunload = () => {
  clearInterval(ping);
}


//----------------------------------------------------------------------------------------------------------------------


function createHost() {
  var questionInput = document.getElementById("questionInput");

  var url = "http://" + window.location.host + "/create/" + questionInput.value;
  data = JSON.parse(POST(url));
  console.log(data);
  console.log("Host id is: " + data.id);
  info = data;
  document.getElementById("hostId").innerHTML = "Id is: " + info.id;
  return false;
}


//----------------------------------------------------------------------------------------------------------------------


function createPlayer() {
  var questionInput = document.getElementById("questionInput");
  var url = "http://" + window.location.host + "/createPlayer/" + questionInput.value;
  data = JSON.parse(POST(url));
  console.log(data);
  console.log("Host id is: " + data.id);
  info = data;
  document.getElementById("hostId").innerHTML = "Id is: " + info.id;
  return false;
}


//----------------------------------------------------------------------------------------------------------------------


async function animateJoin(floater, text, input, inputBar) {
  var data = JSON.parse(POST("http://" + window.location.host + "/id/" + questionInput.value));
  if(data != null) {
    height(floater, 0, .4);
    text.classList.remove("sideToSide");
    scale(text, 0, .2);
    height(text, 0, 1);
    await sleep(150);
    inputBar.setAttribute("readonly", "");
    width(input, 80, .5);
    inputBar.value = data.question + '?';
  }

  else {
    translateX(inputBar, '-50px', .2);
    await sleep(150);
    translateX(inputBar, '50px', .2);
    await sleep(150);
    translateX(inputBar, '-25px', .1);
    await sleep(75);
    translateX(inputBar, '0px', .05);
  }
}
