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
  // re-usable template redered with Mustache
  var time = moment(message.createdAt).format('HH:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from : message.from,
    text : message.text,
    createdAt: time
  });

  jQuery('#messages').append(html);

  /* Without using template
  console.log("newMessage",message);
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${moment(message.createdAt).format('HH:mm a')}: ${message.text}`);
  jQuery('#messages').append(li);
  */
})

socket.on('newLocationMessage', function(message){

  var time = moment(message.createdAt).format('HH:mm a');
  var template = jQuery('#message-location-template').html();
  var html = Mustache.render(template, {
    from : message.from,
    url : message.url,
    createdAt: time
  });

  jQuery('#messages').append(html);

  /*
  console.log("newLocationMessage",message);
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>')
  li.text(`${message.from} ${moment(message.createdAt).format('HH:mm a')} :`);
  a.attr('href',message.url);
  li.append(a)
  jQuery('#messages').append(li);
*/
})

// Register event to form element and prevent post default beahivour.
jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  // get value of input element
  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage',{
    from: 'User',
    text: messageTextbox.val()
  }, function(){
    // Acknowladge
    messageTextbox.val('')
  })
})

var btnSendLocation = jQuery('#send-location')

btnSendLocation.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation is not supported')
  }

  btnSendLocation.attr('disabled','disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition(function(geo){

    btnSendLocation.removeAttr('disabled').text('Send Location')
    socket.emit('createGeolocation',{
      latitude: geo.coords.latitude,
      longitude: geo.coords.longitude
    });
  }, function(e){
    console.log("Unable to fetch postion.");
    btnSendLocation.attr('disabled','disabled').text('Error')
  });
})
