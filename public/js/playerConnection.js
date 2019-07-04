var id;
var gameid;
var vote;

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
