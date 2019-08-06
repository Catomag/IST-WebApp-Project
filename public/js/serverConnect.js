var info = null;
var hostInfo = null;
var time = 0;
var setCheckboxes = [];

if(isPlayer) {
}
else {
  //Upadate host
  if(!isPlayer) {
    var ping = setInterval(async () => {
      if(info != null) {
        var url = "http://" + window.location.host + "/hostUpdate/" + info.id;
        var result = {
          value: null
        }

        for(var i = 0; i < setCheckboxes.length; i++) {
          //console.log("This ran");
          info.settings[i].enabled = setCheckboxes[i].html.checked;
        }

        POSTJSON(url, info, result);
        while(result.value == null) {
          await sleep(10);
        }
        info = JSON.parse(result.value);
        console.log("Pinged server!");
        time++;
      }
    }, 200);
  }
}


//----------------------------------------------------------------------------------------------------------------------


window.onbeforeunload = () => {
  clearInterval(ping);
}


//----------------------------------------------------------------------------------------------------------------------


async function createHost() {
  var questionInput = document.getElementById("questionInput");

  var url = "http://" + window.location.host + "/create/" + questionInput.value;
  var result = {
    value: null
  };
  POST(url, result);
  while(result.value == null) {
    await sleep(1);
  }
  await sleep(10);
  var data = JSON.parse(result.value);
  info = data;
  console.log("Host id is: " + data.id);
}


//----------------------------------------------------------------------------------------------------------------------


async function createPlayer(id) {
  if(id == null || id == "") {
    return null;
  }
  id = id.toUpperCase();
  var url = "http://" + window.location.host + "/id/" + id;
  var result = {
    value: null
  };
  POST(url, result);
  while(result.value == null) {
    await sleep(10);
  }
  hostInfo = JSON.parse(result.value);

  if(hostInfo == null) {
    return;
  }

  url = "http://" + window.location.host + "/createPlayer/" + id;
  POST(url, result);
  while(result.value == null) {
    await sleep(10);
  }

  info = JSON.parse(result.value);
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
    input.style.maxWidth = "10000000px";
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


async function questionToSettings(floater, text, input, inputBar) {
  createHost();
  console.log("Succesfully connected to server");

  var ebicHtml = '<div id="settings"></div>';
  var checkbox = '<input type="checkBox" style="float: left; margin-top: 5px"/> <p type="checkBox" style="float: left; margin-top: 7.5px">sup peeps</p>';

  height(floater, 0, .75);
  text.innerHTML = "Adjust your game!";
  fontSize(text, "26pt", .5);
  await sleep(350);
  inputBar.setAttribute("readonly", "");
  inputBar.style.textTransform = "none";
  input.style.maxWidth = "10000000px";
  margin(input, "0 5%", .5);

  var containerElem = createElementFromHTML('div', ebicHtml);
  var container = document.body.insertAdjacentElement('beforeend', containerElem);
  while(info == null) {
    await sleep(10);
  }

  for (var i = 0; i < info.settings.length; i++) {
    var htmlThing = createElementFromHTML('input', '<input type="checkBox" style="float: left; margin-top: 5px"/>');
    var paar = createElementFromHTML('p', '<p type="checkBox" style="float: left; margin-top: 7.5px; font-size:16pt">' + info.settings[i].name +'</p>');
    var checkbox = {
      html: null,
      index: i
    }
    checkbox.html = container.insertAdjacentElement('beforeend', htmlThing);
    var paaar = container.insertAdjacentElement('beforeend', paar);
    container.insertAdjacentHTML('beforeend', '<br>');
    container.insertAdjacentHTML('beforeend', '<br>');
    container.insertAdjacentHTML('beforeend', '<br>');
    checkbox.html.checked = info.settings[i].enabled;
    setCheckboxes.push(checkbox);
  }
}


//----------------------------------------------------------------------------------------------------------------------

async function create(floater, text, input, inputBar) {

}
