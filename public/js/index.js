var socket = io(); // Connect to server

// Listen connect event
socket.on('connect', function(){
  console.log('connected to server.');
})

// Listen Disconnect event
socket.on('disconnect', function(){
  console.log('Disconnected from server.');
})

// Listen Custom Event newMessage
socket.on('newMessage', function(message){
  console.log("newMessage",message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
})

// Register event to form element and prevent post default beahivour.
jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  var text = jQuery('[name=message]').val();

  socket.emit('createMessage',{
    from: 'User',
    text: text
  }, function(){
    // Acknowlage
  })
})
