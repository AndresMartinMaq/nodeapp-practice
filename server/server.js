const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {genMsg} = require('./utils/message');

//We use path instead of simlply __dirname + /../public because it joins
//paths correctly. Otherwise, we'd get a weird /server/../public path which might cause problems later
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
//The following two lines are needed for SocketIO.
const server = http.createServer( app );
const io = socketIO(server);

//Listen to event when a client connects
io.on('connection', (socket) => {
	console.log('New User connected-');

	socket.emit('newMessage', genMsg('Adnim', 'Welcome to the Chat!'));
	socket.broadcast.emit('newMessage', genMsg('Admin', 'New User joined'));

	socket.on('createMessage', (data, ack) => {
		console.log('New Message gotten: ', data);
		io.emit('newMessage', genMsg(data.from, data.text));
		
		if(ack){ ack(); }
	});

	socket.on('disconnect', () => console.log('Client Disconnected'));
});

//Serve the public folder
app.use(express.static(publicPath));


//Begin Serving
server.listen(PORT, () => console.log('Started serving at port '+PORT));