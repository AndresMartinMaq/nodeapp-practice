//Calling this method requests the server to create and keep a connection open.
var socket = io();

//Built-in Events
socket.on('connect', function(){
	console.log('Connected to Sever');

	//socket.emit('createMessage', {from: 'fingers@west.com',text: 'Chaos is a ladder...'});
});

socket.on('disconnect', () => console.log('Disconnected from Sever'));

//Custom Events
socket.on('newMessage', function(data){
	console.log("Client gets new Message ", data);
	var li = $('<li></li>');
	li.text(`${data.from}: ${data.text}`);

	$('#messages').append(li);
});

$('#msgForm').on('submit', function(e){
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'user',
		text: $('[name=message]').val()
	});
});