var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = {};
var colors = ['red', 'green', 'blue', 'black', 'orange'];
var UPDATE_INTERVAL = 50;
var SPEED = 10;
var RIGHT_BORDER = 800;
var BOTTOM_BORDER = 600;

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.get('/app.js', function (req, res) {
  res.sendfile('app.js');
});

io.on('connection', function (socket) {
  var playerColor = colors.pop();
  players[playerColor] = {
    x: 0,
    y: 0,
    color: playerColor,
    direction: 'none'
  };
  socket.color = playerColor;
  socket.emit('initialize', players);
  socket.on('playerMove', function (dirrection) {
    updatePosition(socket, dirrection);
  });
  socket.on('disconnect', function () {
    removePlayer(socket);
  });
});

http.listen(3000, function () {
  startGame();
});

function startGame() {
  setInterval(function () {
    for (var player in players) {
      if (players.hasOwnProperty(player)) {
        player = players[player];
        switch (player.direction) {
          case 'up':
            player.y -= SPEED;
            break;
          case 'down':
            player.y += SPEED;
            break;
          case 'left':
            player.x -= SPEED;
            break;
          case 'right':
            player.x += SPEED;
            break;
        }

        checkBorders(player);
      }
    }
    io.emit('update', players);
  }, UPDATE_INTERVAL);
}

function updatePosition(socket, direction) {
  var player = players[socket.color];
  player.direction = direction;
}

function removePlayer(socket) {
  var color = socket.color;
  delete players[color];
  colors.push(color);
}

function checkBorders(player) {
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + 50 > RIGHT_BORDER) {
    player.x = RIGHT_BORDER - 50;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.y + 50 > BOTTOM_BORDER) {
    player.y = BOTTOM_BORDER - 50;
  }
}