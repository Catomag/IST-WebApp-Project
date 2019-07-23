var info = null;
var hostInfo = null;
var time = 0;

if(isPlayer) {
  /*var ping = setInterval(() => {
    if(info.id != null) {
      var url = "http://" + window.location.host + "/playerPing/" + info.id;
      POST(url);
      time++;
    }
  }, 800);*/
}
else {
  //hostPing
  if(!isPlayer) {
    var ping = setInterval(() => {
      if(info != null) {
        var url = "http://" + window.location.host + "/hostPing/" + info.id;
        POST(url);
        console.log("Pinged server!");
        time++;
      }
    }, 400);
  }
}


//----------------------------------------------------------------------------------------------------------------------


window.onbeforeunload = () => {
  clearInterval(ping);
  if(isPlayer) {
    var url = "http://" + window.location.host + "/removePlayer/" + hostInfo.id;
    POSTINFO(url, info);
  }
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
}


//----------------------------------------------------------------------------------------------------------------------


function createPlayer(id) {
  if(id == null || id == "") {
    return null;
  }
  var url = "http://" + window.location.host + "/id/" + id;
  hostInfo = JSON.parse(POST(url));

  if(hostInfo == null) {
    return;
  }

  url = "http://" + window.location.host + "/createPlayer/" + id;
  info = JSON.parse(POST(url));
  console.log(info);
  document.getElementById("hostId").innerHTML = "Id is: " + hostInfo.id;
}


//----------------------------------------------------------------------------------------------------------------------


async function join(floater, text, input, inputBar) {
  createPlayer(questionInput.value);
  if(info != null) {
    console.log("Succesfully connected to host");
    height(floater, 0, .4);
    text.classList.remove("sideToSide");
    scale(text, 0, .2);
    height(text, 0, 1);
    await sleep(150);
    inputBar.setAttribute("readonly", "");
    inputBar.style.textTransform = "none";
    width(input, 80, .5);
    inputBar.value = hostInfo.question + '?';
  }

  else {
    translateX(inputBar, '-30px', .2);
    await sleep(150);
    translateX(inputBar, '30px', .2);
    await sleep(150);
    translateX(inputBar, '-15px', .1);
    await sleep(75);
    translateX(inputBar, '0px', .05);
  }
}


//----------------------------------------------------------------------------------------------------------------------


async function create(floater, text, input, inputBar) {
  
}
