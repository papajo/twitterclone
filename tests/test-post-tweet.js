var mongoose = require('mongoose')
  , config = require('../config');

process.env.NODE_ENV = 'test'

var connection = mongoose.createConnection(
    config.get('database:host')
  , config.get('database:name')
  , config.get('database:port'));

describe('Test suite POST /api/tweets', function() {
	
	before(function(done) {
		//drop the database named twittertest
		//call done(null) after the database was dropped
		connection.db.dropDatabase(function(err) {
			if (err) return 'error encountered during drop database'
		})
		done(null);
	})
	it('test case scenario 1', function(done) {
		done()
	})

	it('test case scenario 2', function(done) {
		done()
	})
})