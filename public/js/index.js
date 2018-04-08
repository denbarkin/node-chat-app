var socket = io(); // Connect to server

// Listen connect event
socket.on('connect', function(){
  console.log('connected to server.');

// Create an message send it to server when connected.
/*
socket.emit('createMessage', {
    from: 'barkin',
    text: 'Hi there!'
  })
*/
})

// Server with Acknowlage Emit
socket.emit('createMessage', {
  from: 'Duygu',
  text: 'Mercan uyudu  Yaşasın'
}, function(acknowlage){
  console.log('Acknowlage Received: ', acknowlage);
})

// Listen Disconnect event
socket.on('disconnect', function(){
  console.log('Disconnected from server.');
})

// Listen Custom Event newMessage
socket.on('newMessage', function(message){
  console.log("newMessage",message);
})
