var mongoose = require('mongoose')
  , config = require('../config')
  , request = require('supertest')
  , app = require('../index');

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
	it('POST route 1', function(done) {
		request(app)
			.post('/api/tweets')
			.set('Accept', 'text/plain')
			.expect('Content-Type', /utf-8/)
			.expect(403, done)
		 
	})

	it('test case scenario 2', function(done) {
		done()
	})
})