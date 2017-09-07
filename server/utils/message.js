const genMsg = function(from, text){
	return { from, text, 
		createdAt: new Date().getTime()
	};
};

const genLocMsg = function(from, lat, long){
	return { 
		from, 
		url: `https://www.google.com/maps?q=${lat},${long}`, 
		createdAt: new Date().getTime()
	};
};


module.exports = {genMsg, genLocMsg};