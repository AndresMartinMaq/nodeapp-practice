//Calling this method requests the server to create and keep a connection open.
var socket = io();

//Built-in Events
socket.on('connect', function(){
	console.log('Connected to Sever');
	//socket.emit('createMessage', {from: 'fingers@west.com',text: 'Chaos is a ladder...'});
	var params = $.deparam(window.location.search);

	socket.emit('join', params, function(error){
		//Ack function
		if (error){
			//Redirect the user to the home page (this looks pretty brute)
			alert(error);
			window.location.href = '/';
		} else {
			console.log('No Error');
		}
	});
});

socket.on('disconnect', () => console.log('Disconnected from Sever'));

//Custom Events, listening
socket.on('newMessage', function(data){
	var timeStr = moment(data.createdAt).format('HH:mm');

	var template = $('#msgTemplate').html();
	var html = Mustache.render(template, {
		from: data.from,
		text: data.text,
		createdAt: timeStr
	});

	$('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocMessage', function(data){
	var timeStr = moment(data.createdAt).format('HH:mm');

	var template = $('#msgLocTemplate').html();
	var html = Mustache.render(template, {
		from: data.from,
		createdAt: timeStr,
		url: data.url
	});
	$('#messages').append(html);
	scrollToBottom();
});

socket.on('updateUserList', function(userArr){
	//Update the leftwards list of users present.
	var ol = $('<ol></ol>');

	userArr.forEach( function(uName){
		ol.append($('<li></li>').text(uName));
	});

	$('#users').html(ol);
});

//Fire event when button clicked
$('#msgForm').on('submit', function(e){
	e.preventDefault();

	socket.emit('createMessage', {
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

//Scrolling to the bottom chatlike
function scrollToBottom(){
	//Selecetors
	var msgScreen = $('#messages');
	var newestMsg = msgScreen.children('li:last-child');
	
	//Heights
	var clientHeight = msgScreen.prop('clientHeight');
	var scrollTop = msgScreen.prop('scrollTop');
	var scrollHeight = msgScreen.prop('scrollHeight');
	var newestMsgHeight = newestMsg.innerHeight();
	var prevMsgHeight = newestMsg.prev().innerHeight();

	if (clientHeight+scrollTop+newestMsgHeight+prevMsgHeight >= scrollHeight){
		//Make it scroll down
		msgScreen.scrollTop(scrollHeight);
	}
}