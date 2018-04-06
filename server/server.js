const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath))

// register event -> connection event
io.on('connection', (socket) => {
  console.log('New user connected...');

  // Send a new email event
  socket.emit('newMessage', {
    to :"barkin",
    text :"Hi!",
    createdAt: new Date().toString()
  });

  // Listen new type of event : Create Message
  socket.on('createMessage', (message) => {
    console.log("createMessage:", message)
  });

  // Once socket connected. Listen new event on this socket
  socket.on('disconnect', (socket) => {
    console.log('Client disconnected from server...');
  })
});

// Listen Event --Disconnected
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
