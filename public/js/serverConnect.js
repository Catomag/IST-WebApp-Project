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

var lastSelectIndex = 0;

var _voteElements = [];

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

      for (var i = 0; i < _voteElements.length; i++) {
        if(!hostInfo.settings[0].enabled) {

        }

        else {
          if(_voteElements[i].selected) {
            info.votes[i] = 1;
          }
          else {
            info.votes[i] = 0;
          }
        }
      }

      var url = "http://" + window.location.host + "/playerUpdate/" + hostInfo.id;
      var result = {
        value: null
      }

      POSTJSON(url, info, result);
      while(result.value == null) {
        await sleep(1);
      }
      info = JSON.parse(result.value);

      url = "http://" + window.location.host + "/id/" + hostInfo.id;
      result = {
        value: null
      }

      POST(url, result);
      while(result.value == null) {
        await sleep(1);
      }
      hostInfo = JSON.parse(result.value);

      updatePlayer();
      console.log("Pinged server!");
    }
  }, 100);
}
else {
  //Upadate host
  var ping = setInterval(async () => {
    if(info != null) {
      if(info.id != "") {
        for (var i = 0; i < info.votes.length; i++) {
          info.votes[i].votes = 0;
          for (var j = 0; j < info.players.length; j++) {
            info.votes[i].votes += info.players[j].votes[i];
          }
        }

        var url = "http://" + window.location.host + "/hostUpdate/" + info.id;
        var result = {
          value: null
        }

        POSTJSON(url, info, result);
        while(result.value == null) {
          await sleep(1);
        }
        info = JSON.parse(result.value);
        console.log("Pinged server!");
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
    inputBar.value = hostInfo.question;
    
    if(hostInfo.question.charAt(hostInfo.question.length-1) != '?') {
      inputBar.value += '?';
    }

    for(var i = 0; i < hostInfo.votes.length; i++) {

      var voteHtml = '<div id="voteElem' + i + '" class="bigButton" onmouseout="lowlight(\'' + i + '\')" onmouseover="highlight(\'' + i + '\')" onclick="updateButton(\'' + i + '\')"><p class="unselectable" style="margin: auto auto; text-align: center">' + hostInfo.votes[i].name + ' ' + '0%' + '</p></div>';
      var voteElem = createElementFromHTML('div', voteHtml);
      voteElem.style.backgroundColor = '' + hostInfo.votes[i].color;
      gId('main').insertAdjacentElement('beforeend', voteElem);
      var c = voteElem.style.backgroundColor.split('(')[1].split(')')[0].split(', ');
      var v = {
        elem: voteElem,
        selected: false,
        col: {
          r: c[0],
          g: c[1],
          b: c[2]
        }
      }
      _voteElements.push(v);
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


function lowlight(index) {
  var v = _voteElements[index];
  var vStyle = v.elem.style;
  var col = v.col;
  var color = {
    r: Number(col.r),
    g: Number(col.g),
    b: Number(col.b)
  };

  if(v.selected) {
    color.r *= .6;
    color.g *= .6;
    color.b *= .6;
  }

  else {
    color.r *= 1;
    color.g *= 1;
    color.b *= 1;
  }

  vStyle.backgroundColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}


//----------------------------------------------------------------------------------------------------------------------


function highlight(index) {
  var v = _voteElements[index];
  var vStyle = v.elem.style;
  var col = v.col;
  var color = {
    r: Number(col.r),
    g: Number(col.g),
    b: Number(col.b)
  };

  if(v.selected) {
    color.r *= .5;
    color.g *= .5;
    color.b *= .5;
  }
  else {
    color.r *= .9;
    color.g *= .9;
    color.b *= .9;
  }

  vStyle.backgroundColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}


//----------------------------------------------------------------------------------------------------------------------


function updateButton(index) {
  var v = _voteElements[index];
  var vStyle = v.elem.style;
  v.selected = !v.selected;
  highlight(index);
}


//----------------------------------------------------------------------------------------------------------------------


async function questionToSettings(floater, text, input, inputBar) {
  clearInterval(centerInput);
  createHost();
  console.log("Succesfully connected to server");

  var ebicHtml = '<div id="settings"></div>';
  var checkbox = '<input type="checkBox" style="float: left; margin-top: 5px"/> <p type="checkBox" style="float: left; margin-top: 7.5px">sup peeps</p>';
  var voteContainerHtml = '<div id="votesContainer"></div>';
  var voteHolderHtml = '<div style="background-color: rgb(63, 47, 71); height: 100%; min-height: 130px; width: 90%; overflow-y: auto"></div>';
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
  margin(inputBar, "0 20%", .5);

  containerElem = createElementFromHTML('div', ebicHtml);
  nextButton = createElementFromHTML('div', nextButtonHtml);
  addButton = createElementFromHTML('div', addButtonHtml);
  var removeButton = createElementFromHTML('div', removeButtonHtml);
  var thing = createElementFromHTML('div', '<div style="width: 10%; backgroundColor: green; min-width: 130px; min-height: 65px;"></div>');
  voteContainer = createElementFromHTML('div', voteContainerHtml);
  voteHolder = createElementFromHTML('div', voteHolderHtml);
  container = document.body.insertAdjacentElement('beforeend', containerElem);

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
    var style = window.getComputedStyle(voteElements[i].elem);
    var color = inputStyle.getPropertyValue('background-color');

    var vote = new Vote();
    vote.name = voteElements[i].elem.value;
    vote.votes = 0;
    vote.color = voteElements[i].elem.style.backgroundColor;
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
  var voteHtml = '<input class="voteInput medText" type="text" style="color: rgb(255, 255, 255);"  onblur="_blur(\'' + voteElements.length + '\')" onfocus="_focus(\'' + voteElements.length + '\')" onmouseout="_lowlight(\'' + voteElements.length + '\')" onmouseover="_highlight(\'' + voteElements.length + '\')" placeholder="Write answer" onsubmit="return false"/>';
  var voteElem = createElementFromHTML('input', voteHtml);

  voteElem.style.backgroundColor = 'rgb(' + (Math.random()*200+20) + ',' + (Math.random()*200+20) + ',' + (Math.random()*200+20) + ')';
  voteHolder.insertAdjacentElement('beforeend', voteElem);
  var c = voteElem.style.backgroundColor.split('(')[1].split(')')[0].split(', ');
  var v = {
    elem: voteElem,
    selected: false,
    col: {
      r: c[0],
      g: c[1],
      b: c[2]
    }
  }
  voteElements.push(v);
  voteElem.focus();
}


//----------------------------------------------------------------------------------------------------------------------


function removeResponse() {
  if(voteElements.length > 0) {
    var lel = voteElements.pop();
    lel.elem.remove();
  }
}


//----------------------------------------------------------------------------------------------------------------------


function _focus(index) {
  var v = voteElements[index];
  v.selected = true;
  _highlight(index);
}


//----------------------------------------------------------------------------------------------------------------------


function _blur(index) {
  var v = voteElements[index];
  v.selected = false;
  _highlight(index);
}


//----------------------------------------------------------------------------------------------------------------------


function _lowlight(index) {
  var v = voteElements[index];
  var vStyle = v.elem.style;
  var col = v.col;
  var color = {
    r: Number(col.r),
    g: Number(col.g),
    b: Number(col.b)
  };

  if(v.selected) {
    color.r *= .6;
    color.g *= .6;
    color.b *= .6;
  }

  else {
    color.r *= 1;
    color.g *= 1;
    color.b *= 1;
  }

  vStyle.backgroundColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}


//----------------------------------------------------------------------------------------------------------------------


function _highlight(index) {
  var v = voteElements[index];
  var vStyle = v.elem.style;
  var col = v.col;
  var color = {
    r: Number(col.r),
    g: Number(col.g),
    b: Number(col.b)
  };

  if(v.selected) {
    color.r *= .5;
    color.g *= .5;
    color.b *= .5;
  }
  else {
    color.r *= .9;
    color.g *= .9;
    color.b *= .9;
  }

  vStyle.backgroundColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}


//----------------------------------------------------------------------------------------------------------------------


function updatePlayer() {
  var total = 0;
  for (var i = 0; i < hostInfo.votes.length; i++) {
    total += hostInfo.votes[i].votes;
  }

  for (var i = 0; i < _voteElements.length; i++) {
    if(isNaN((hostInfo.votes[i].votes/total)*100)) {
      _voteElements[i].elem.children[0].innerHTML = hostInfo.votes[i].name + ' ' + 0 + '%';
    }
    else {
      _voteElements[i].elem.children[0].innerHTML = hostInfo.votes[i].name + ' ' + Math.round((hostInfo.votes[i].votes/total)*100) + '%';
    }
  }
}


//----------------------------------------------------------------------------------------------------------------------


async function create(floater, text, input, inputBar) {

}
