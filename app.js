var socket = io();

var arrowUpIsDown = false;
var arrowDownIsDown = false;
var arrowLeftIsDown = false;
var arrowRightIsDown = false;

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
}

function endGame() {
  document.removeEventListener('keydown', onKeyDown, false);
  document.removeEventListener('keyup', onKeyUp, false);
}

function onKeyDown(e) {
  switch (e.keyCode) {
    case 38:
      if (!arrowUpIsDown) {
        socket.emit('playerMove', 'up');
        arrowUpIsDown = true;
      }
      break;
    case 40:
      if (!arrowDownIsDown) {
        socket.emit('playerMove', 'down');
        arrowDownIsDown = true;
      }
      break;
    case 37:
      if (!arrowLeftIsDown) {
        socket.emit('playerMove', 'left');
        arrowLeftIsDown = true;
      }
      break;
    case 39:
      if (!arrowRightIsDown) {
        socket.emit('playerMove', 'right');
        arrowRightIsDown = true;
      }
      break;
  }
}

function onKeyUp(e) {
  switch (e.keyCode) {
    case 38:
      arrowUpIsDown = false;
      break;
    case 40:
      arrowDownIsDown = false;
      break;
    case 37:
      arrowLeftIsDown = false;
      break;
    case 39:
      arrowRightIsDown = false;
      break;
  }
  if (!arrowUpIsDown && !arrowDownIsDown && !arrowLeftIsDown && !arrowRightIsDown) {
    socket.emit('playerMove', 'none');
  }
}

function drawScreen(players) {
  document.body.innerHTML = '';

  for (var player in players) {
    if (players.hasOwnProperty(player)) {
      player = players[player];
      var playerDiv = document.createElement('div');
      playerDiv.style.backgroundColor = player.color;
      playerDiv.style.left = player.x + 'px';
      playerDiv.style.top = player.y + 'px';
      playerDiv.className = 'player';
      document.body.appendChild(playerDiv);
    }
  }
}