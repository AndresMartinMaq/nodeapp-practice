//Calling this method requests the server to create and keep a connection open.
var socket = io();

//Built-in Events
socket.on('connect', function(){
	console.log('Connected to Sever');
	//socket.emit('createMessage', {from: 'fingers@west.com',text: 'Chaos is a ladder...'});
});

socket.on('disconnect', () => console.log('Disconnected from Sever'));

//Custom Events, listening
socket.on('newMessage', function(data){
	var timeStr = moment(data.createdAt).format('HH:mm');

	//Notice that we populate the html elements not with template strings but
	//using the jQuery methods (.text). This is best against malicious injections.
	var li = $('<li></li>');
	li.text(`${data.from} · ${timeStr}: ${data.text}`);

	$('#messages').append(li);
});

socket.on('newLocMessage', function(data){
	var timeStr = moment(data.createdAt).format('HH:mm');

	var li = $('<li></li>');
	var a = $('<a target="_blank">My Current Location</a>');
	li.text(`${data.from} · ${timeStr}: `);
	a.attr('href', data.url);
	li.append(a);
	$('#messages').append(li);
});

//Fire event when button clicked
$('#msgForm').on('submit', function(e){
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'user',
		text: $('[name=message]').val()
	}, 
	//This is the ack callback
	function(){
		$('[name=message]').val('');
	});
});

//Location Sending stuff
var locationBtt = $('#sendLoc');
locationBtt.on('click', function(){
	if(!navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}

	locationBtt.attr('disabled', 'disabled').text('Sending...');

	//getCurrentPosition takes a success and failure callback.
	navigator.geolocation.getCurrentPosition( function(position){
		locationBtt.removeAttr('disabled').text('Send Location');
		socket.emit('createLocMessage', {
			lat: position.coords.latitude,
			long: position.coords.longitude
		});
	}, function(){
		locationBtt.removeAttr('disabled').text('Send Location');
		alert('Unable to fetch location');
	});
});