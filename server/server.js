const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath))

// register event -> connection event
io.on('connection', (socket) => {
  console.log('New user connected...');

  // Wellcome message from Admin
  socket.emit('newMessage',generateMessage('Admin','Welcome Simple Chat App...'))

  // New User connected message from admin,
  socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user is joined.'))

  // Listen new type of event : Create Message
  // Acknowlage send back to the Client to Inform the status
  socket.on('createMessage', (message, callback) => {
    console.log("createMessage:", message)
    socket.broadcast.emit('newMessage', generateMessage(message.from,message.text))
    callback('send from server')
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
