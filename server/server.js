const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');


const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath))

// register event -> connection event
io.on('connection', (socket) => {
  console.log('New user connected...');

  socket.on('join', (params, callback)=>{
    if(!isRealString(params.name) && !isRealString(params.room)){
      return callback('Name and Rooms must be valid !')
    }

    // Socket IO Rooms Feature
    socket.join(params.room);
    // Add user to Users Buffer
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    // Send Event to clients update user listen
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // Wellcome message from Admin Send to socket just connected
    socket.emit('newMessage',generateMessage('Admin','Welcome  Chat Application.'))

    // New User connected message send to Room,
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} is joined.`))

    callback();
  })

  // Listen new type of event : Create Message
  // Acknowlage send back to the Client to Inform the status
  socket.on('createMessage', (message, callback) => {
    console.log("createMessage:", message)
    //socket.broadcast.emit('newMessage', generateMessage(message.from,message.text))
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback();
  });

  socket.on('createGeolocation', (location) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', location.latitude, location.longitude))
  })

  // Once socket connected. Listen new event on this socket
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    console.log('Disconnected:', user);
    if(user){
      io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left.`));
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    }
  })
});

// Listen Event --Disconnected
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
