var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var players = {};
var colors = ['red', 'green', 'blue', 'black', 'orange'];
var updateInterval = 50;
var speed = 10;

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
            player.y -= speed;
            break;
          case 'down':
            player.y += speed;
            break;
          case 'left':
            player.x -= speed;
            break;
          case 'right':
            player.x += speed;
            break;
        }
      }
    }
    io.emit('update', players);
  }, updateInterval);
}

function updatePosition(socket, direction) {
  var player = players[socket.color];
  player.direction = direction;
}