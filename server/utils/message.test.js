var expect = require('expect');
var {genMsg, genLocMsg} = require('./message');

//Test group
describe('generateMessage', () => {

	//Single test
	it('should generate correct message object', () => {
		var from = 'redWoman';
		var text = 'You are the prince that was promised.';
		var msg = genMsg(from, text);
		console.log(msg);
		console.log(expect);

		expect('something truthy').toExist();
		expect(msg.createdAt).toBeA('number');
		expect(msg).toInclude({from, text});
	});
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'Deb';
    var latitude = 15;
    var longitude = 19;
    var url = 'https://www.google.com/maps?q=15,19';
    var message = genLocMsg(from, latitude, longitude);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, url});
  });
});