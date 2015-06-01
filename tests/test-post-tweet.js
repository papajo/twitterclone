var mongoose = require('mongoose')
  , config = require('../config')
  , request = require('supertest')
  , app = require('../index')

var Session = require('supertest-session')({
	app: require('../index'),
	envs: { NODE_ENV: 'test' }
});

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

	it('POST route 2', function(done) {

		var chai = require('chai')
		  , expect = chai.expect

		var session = new Session()
		var testUser = 	{  id: 'test'
						 , name: 'Test'
						 , password: 'test'
						 , email: 'test@test.com'
						}
		var testTweet = {}

		session
			.post('/api/users')
			.send( {user: testUser })
			.expect(200)
			.end(function(err, response) {
				if (err) return response.sendStatus(err)
			})

		session
			.post('/api/tweets')
			.send({ tweet: testTweet })
			.expect(200, function(err, response) {
				try {
					expect(response.body).to.have.property('tweet')
					done(null)
				} catch (err) {
					done(err)
				}
			})
	})
})