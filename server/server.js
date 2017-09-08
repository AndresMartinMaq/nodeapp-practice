const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {genMsg, genLocMsg} = require('./utils/message');
const {isValidStr} = require('./utils/validation');
const Users = require('./utils/users');

//We use path instead of simlply __dirname + /../public because it joins
//paths correctly. Otherwise, we'd get a weird /server/../public path which might cause problems later
const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
//The following two lines are needed for SocketIO.
const server = http.createServer( app );
const io = socketIO(server);

const users = new Users();

//Listen to event when a client connects
io.on('connection', (socket) => {
	console.log('New User connected-');
	
	//Chatroom Joining
	socket.on('join', (params, ack) => {
		if(!isValidStr(params.name) || !isValidStr(params.room) ){
			ack('Name and Room name are required');
		} else {
			socket.join(params.room);

			//Keep track of the user's position. This is sloppy, it would be better to update their room rather than remove and recreate them.
			users.removeUser(socket.id);
			users.addUser(socket.id, params.name, params.room);

			socket.emit('newMessage', genMsg('Admin', 'Welcome to the Chat!'));
			socket.broadcast.to(params.room).emit('newMessage', genMsg('Admin', `User ${params.name} has joined.`));
			io.to(params.room).emit('updateUserList', users.getUserList(params.room));

			ack();
		}
	});

	//Message Receiving
	socket.on('createMessage', (data, ack) => {
		var user = users.getUser(socket.id);
		
		if (user && isValidStr(data.text)){
			io.to(user.room).emit('newMessage', genMsg(user.name, data.text));
		}
		
		if(ack){ ack(); }
	});

	socket.on('createLocMessage', (coords) => {
		var user = users.getUser(socket.id);
		if(!user){ return; }
		io.to(user.room).emit('newLocMessage', genLocMsg(user.name, coords.lat, coords.long));
	});

	socket.on('disconnect', () => {
		var user = users.removeUser(socket.id);
		console.log('Client Disconnected:', user);
		if (user){
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', genMsg('Admin', user.name+' has left.'));
		}
	});
});

//Serve the public folder
app.use(express.static(publicPath));


//Begin Serving
server.listen(PORT, () => console.log('Started serving at port '+PORT));