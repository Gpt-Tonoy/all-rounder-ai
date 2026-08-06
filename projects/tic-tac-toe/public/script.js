let start;
let running = false;

function startStopwatch() {
  if (!running) {
    start = new Date().getTime() - startTime;
    running = true;
    document.getElementById("stopwatch").innerHTML = `00:00:00`;
    updateStopwatch();
  }
}

function stopStopwatch() {
  running = false;
}

function resetStopwatch() {
  running = false;
  document.getElementById("stopwatch").innerHTML = "00:00:00";
  start = new Date().getTime() - startTime;
  startTime = new Date().getTime();
}

function updateStopwatch() {
  if (running) {
    var time = new Date().getTime() - start;
    var minutes = Math.floor((time / 1000) / 60);
    var seconds = Math.floor((time / 1000) % 60);
    var milliseconds = Math.floor((time % 1000) / 10);
    document.getElementById("stopwatch").innerHTML = `${padZero(minutes)}:${padZero(seconds)}:${padZero(milliseconds)}`;
    setTimeout("updateStopwatch()", 10);
  }
}

function padZero(value) {
  return (value < 10 ? "0" : "") + value