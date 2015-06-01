var fs = require('fs');
var util = require('util');

describe('Simple tests', function() {
	
	it('check if dummy file exists', function(done) {
		fs.exists('./dummy', function(exists) {
		util.debug(exists ? true: false);
		if (exists) {	
			return done(null)
		}
		return done(new Error('File doesn\'t exist'))
		});
		
	});
});