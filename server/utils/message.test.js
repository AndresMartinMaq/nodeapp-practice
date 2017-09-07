const expect = require('expect');
const {genMsg} = require('./message');

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