var socket = io();

var currentDirection = 'none';
var keysCurrentlyDown = [];

var KEYS_MAP = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

socket.on('update', function (data) {
  drawScreen(data);
});

socket.on('initialize', function (data) {
  drawScreen(data);
  startGame();
});

function startGame() {
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  window.addEventListener('blur', onLostFocus, false);
  window.addEventListener('contextmenu', onLostFocus, false);
}

function endGame() {
  document.removeEventListener('keydown', onKeyDown, false);
  document.removeEventListener('keyup', onKeyUp, false);
  window.removeEventListener('blur', onLostFocus, false);
  window.removeEventListener('contextmenu', onLostFocus, false);
}

function onKeyDown(e) {
  if (KEYS_MAP[e.keyCode]) {
    if (keysCurrentlyDown.indexOf(KEYS_MAP[e.keyCode]) === -1) {
      keysCurrentlyDown.push(KEYS_MAP[e.keyCode]);
      changeDirection();
    }
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}

function onKeyUp(e) {
  var positionToDelete;
  if (KEYS_MAP[e.keyCode]) {
    positionToDelete = keysCurrentlyDown.indexOf(KEYS_MAP[e.keyCode]);
    if (positionToDelete !== -1) {
      keysCurrentlyDown.splice(positionToDelete, 1);
    }

    if (!keysCurrentlyDown.length || (keysCurrentlyDown.length && keysCurrentlyDown[keysCurrentlyDown.length - 1] !== currentDirection)) {
      changeDirection();
    }

    e.stopPropagation();
    e.preventDefault();
    return false;
  }
}

function onLostFocus(e) {
  keysCurrentlyDown = [];
  changeDirection();
}

function changeDirection() {
  if (keysCurrentlyDown.length) {
    currentDirection = keysCurrentlyDown[keysCurrentlyDown.length - 1];
  } else {
    currentDirection = 'none';
  }
  sendDirectionToServer();
}

function sendDirectionToServer() {
  socket.emit('playerMove', currentDirection);
}

function drawScreen(players) {
  var canvas = document.getElementById('canvas').getContext("2d");
  canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);

  for (var player in players) {
    if (players.hasOwnProperty(player)) {
      player = players[player];
      canvas.fillStyle = player.color;
      canvas.fillRect(player.x, player.y, 50, 50);
    }
  }
}