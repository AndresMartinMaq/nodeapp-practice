//This class is a collection of users. This really grinds my OO gears.
class Users {
	constructor(){
		this.users = [];
	}
	addUser(id, name, room){
		var user = {id, name, room};
		this.users.push(user);
		console.log('User added, list:', this.users);
		return user;
	}
	removeUser(id){
		//Returns user that was removed
		var user = this.getUser(id);
		if (user){
			this.users = this.users.filter(u => u.id !== id);
		}
		console.log('User removed called, list:', this.users);
		return user;
	}
	getUser(id){
		return this.users.filter(user => user.id === id)[0];
	}
	getUserList(room){
		var result = this.users.filter( user => user.room === room);
		var namesArr = result.map( user => user.name);
		return namesArr;
	}
}

module.exports = Users;