var info = null;
var hostInfo = null;
var time = 0;
var setCheckboxes = [];
var voteElements = [];
var doneResponses = false;

var containerElem;
var nextButton;
var addButton;
var voteContainer;
var voteHolder;
var container;

class Vote {
  constructor() {
    this.name;
    this.votes;
    this.color;
  }
}

if(isPlayer) {
  var ping = setInterval(async () => {
    if(info != null) {
      var url = "http://" + window.location.host + "/playerUpdate/" + info.id;
      var result = {
        value: null
      }

      POSTJSON(url, info, result);
      while(result.value == null) {
        await sleep(10);
      }
      info = JSON.parse(result.value);

      url = "http://" + window.location.host + "/id/" + info.id;
      result = {
        value: null
      }

      POST(url, result);
      while(result.value == null) {
        await sleep(10);
      }
      hostInfo = JSON.parse(result.value);

      console.log("Pinged server!");
      time++;
    }
  }, 100);
}
else {
  //Upadate host
  var ping = setInterval(async () => {
    if(info != null) {
      if(info.id != "") {
        var url = "http://" + window.location.host + "/hostUpdate/" + info.id;
        var result = {
          value: null
        }

        POSTJSON(url, info, result);
        while(result.value == null) {
          await sleep(10);
        }
        info = JSON.parse(result.value);
        console.log("Pinged server!");
        time++;
      }
    }
  }, 100);
}


//----------------------------------------------------------------------------------------------------------------------


window.onbeforeunload = () => {
  clearInterval(ping);
}


//----------------------------------------------------------------------------------------------------------------------


async function createHost() {
  var questionInput = document.getElementById("questionInput");

  var url = "http://" + window.location.host + "/getTemplate/";
  var result = {
    value: null
  };
  POST(url, result);
  while(result.value == null) {
    await sleep(1);
  }
  var data = JSON.parse(result.value);
  info = data;
  info.question = questionInput.value;
  console.log(info);
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

  result = {
    value: null
  };

  url = "http://" + window.location.host + "/createPlayer/" + id;
  POST(url, result);
  while(result.value == null) {
    await sleep(10);
  }

  info = JSON.parse(result.value);
  document.getElementById("hostId").innerHTML = "Id is: " + hostInfo.id;
}


//----------------------------------------------------------------------------------------------------------------------


async function join(floater, text, input, inputBar) {
  clearInterval(clearNumb);
  questionInput.value = questionInput.value.toUpperCase();
  await createPlayer(questionInput.value);
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

    for(var i = 0; i < hostInfo.votes.length; i++) {
      var voteHtml = '<div class="bigButton" style="" onclick=""><p class="unselectable" style="margin: auto auto; text-align: center"> ' + hostInfo.votes[i].name + ' ' + '0%' + '</p></div>';
      var voteElem = createElementFromHTML('div', voteHtml);
      voteElem.style.backgroundColor = '' + hostInfo.votes[i].color;
      gId('main').insertAdjacentElement('beforeend', voteElem);
    }
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
  //clearInterval(centerInput);
  createHost();
  console.log("Succesfully connected to server");

  var ebicHtml = '<div id="settings"></div>';
  var checkbox = '<input type="checkBox" style="float: left; margin-top: 5px"/> <p type="checkBox" style="float: left; margin-top: 7.5px">sup peeps</p>';
  var voteContainerHtml = '<div id="votesContainer"></div>';
  var voteHolderHtml = '<div style="background-color: rgb(63, 47, 71); height: 100%; width: 90%; overflow-y: auto"></div>';
  var nextButtonHtml = '<div class="button" style="float: right" onclick="startHost()"><center><p class="unselectable">GO!</p></center></div>';
  var addButtonHtml = '<div id="plus" class="verticalCentre" style="float: right" onclick="addResponse()"><center><p class="unselectable">+</p></center></div>';
  var removeButtonHtml = '<div id="plus" class="verticalCentre" style="float: right" onclick="removeResponse()"><center><p class="unselectable">-</p></center></div>';

  height(floater, 0, .75);
  text.innerHTML = "Adjust your game!";
  fontSize(text, "26pt", .5);
  await sleep(350);
  //inputBar.setAttribute("readonly", "");
  inputBar.style.textTransform = "none";
  input.style.maxWidth = "10000000px";
  margin(input, "0 5%", .5);

  containerElem = createElementFromHTML('div', ebicHtml);
  nextButton = createElementFromHTML('div', nextButtonHtml);
  addButton = createElementFromHTML('div', addButtonHtml);
  var removeButton = createElementFromHTML('div', removeButtonHtml);
  var thing = createElementFromHTML('div', '<div style="width: 10%; backgroundColor: green; min-width: 82px; min-height: 65px;"></div>');
  voteContainer = createElementFromHTML('div', voteContainerHtml);
  voteHolder = createElementFromHTML('div', voteHolderHtml);
  container = document.body.insertAdjacentElement('beforeend', containerElem);

  /*while(info == null) {
    await sleep(10);
  }*/

  for (var i = 0; i < info.settings.length; i++) {
    var containerThing = createElementFromHTML('div', '<div></div>');
    var htmlThing = createElementFromHTML('input', '<input type="checkBox" style="float: left; margin-top: 5px"/>');
    var paar = createElementFromHTML('p', '<p type="checkBox" style="float: left; margin-top: 7.5px; font-size:16pt">' + info.settings[i].name +'</p>');
    var checkbox = {
      html: null,
      index: i
    }

    containerThing = container.insertAdjacentElement('beforeend', containerThing);
    checkbox.html = containerThing.insertAdjacentElement('beforeend', htmlThing);
    var paaar = containerThing.insertAdjacentElement('beforeend', paar);
    container.insertAdjacentHTML('beforeend', '<br>');
    container.insertAdjacentHTML('beforeend', '<br>');
    container.insertAdjacentHTML('beforeend', '<br>');
    checkbox.html.checked = info.settings[i].enabled;
    setCheckboxes.push(checkbox);
  }

  container.insertAdjacentElement('beforeend', voteContainer);
  container.insertAdjacentHTML('beforeend', '<br>');

  voteContainer.insertAdjacentElement('beforeend', voteHolder);
  voteContainer.insertAdjacentElement('beforeend', thing);
  thing.insertAdjacentElement('beforeend', addButton);
  thing.insertAdjacentElement('beforeend', removeButton);

  voteHolder.insertAdjacentHTML('beforeend', '<br>');

  container.insertAdjacentHTML('beforeend', '<br>');
  container.insertAdjacentHTML('beforeend', '<br>');
  container.insertAdjacentElement('beforeend', nextButton);
}


//----------------------------------------------------------------------------------------------------------------------


async function startHost() {
  /*if(info.votes.length < 2) {
    var title = gClass('bigText')[0];
    colorChange(title, 'rgb(175, 7, 7)', 1);
    await sleep(75);
    colorChange(title, 'rgb(255, 255, 255)', 1);
    confirm("You need at least 2 responses to start a game");
    return;
  }*/
  for (var i = 0; i < voteElements.length; i++) {
    var style = window.getComputedStyle(voteElements[i]);
    var color = inputStyle.getPropertyValue('background-color');

    var vote = new Vote();
    vote.name = voteElements[i].value;
    vote.votes = 0;
    vote.color = voteElements[i].style.backgroundColor;
    info.votes.push(vote);
  }

  if(setCheckboxes[0].html != null) {
    for(var i = 0; i < setCheckboxes.length; i++) {
      info.settings[i].enabled = setCheckboxes[i].html.checked;
    }
  }

  var url = "http://" + window.location.host + "/create/";
  result = {
    value: null,
  }
  console.log(info);
  POSTJSON(url, info, result);
  while(result.value == null) {
    await sleep(10);
  }
  info = JSON.parse(result.value);
  console.log(info);
  console.log("Question id is: " + info.id);
}


//----------------------------------------------------------------------------------------------------------------------


async function addResponse() {

  var voteHtml = '<input class="voteInput" type="text" style="color: rgb(255, 255, 255); " placeholder="Write option" onsubmit="return false"/>';
  var voteElem = createElementFromHTML('input', voteHtml);

  voteElem.style.backgroundColor = 'rgb(' + (Math.random()*200+20) + ',' + (Math.random()*200+20) + ',' + (Math.random()*200+20) + ')';
  voteHolder.insertAdjacentElement('beforeend', voteElem);
  voteElem.focus();
  voteElements.push(voteElem);
  /*var url = "http://" + window.location.host + "/hostUpdate/" + info.id;
  var result = {
    value: null
  };
  POSTJSON(url, info, result);*/
}


//----------------------------------------------------------------------------------------------------------------------


function removeResponse() {
  if() {
    var lel = voteElements.pop();
    lel.remove();
  }
}


//----------------------------------------------------------------------------------------------------------------------


async function create(floater, text, input, inputBar) {

}
