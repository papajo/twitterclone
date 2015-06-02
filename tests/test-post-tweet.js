process.env.NODE_ENV = 'test'

var mongoose = require('mongoose')
  , config = require('../config')
  , request = require('supertest')
  , expect = require('chai').expect
//  , async = require('async')
  
var app = require('../index')
  , Session = require('supertest-session')({
	  app: app
	, envs: { NODE_ENV: 'test' } 
	})
  , session = new Session()

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

	var testUser = {  id: 'test'
				    , name: 'Test'
			    	, password: 'test'
					, email: 'test@test.com'
					}

	session
		.post('/api/users')
		.send( {user: testUser })
		.expect(200)
		.end(function(err, response) {
			if (err) return response.sendStatus(err)
		})

	it('Test scenario 1', function(done) {
		request(app)
			.post('/api/tweets')
			.send({ tweet: { text: 'Test Tweet', userId: 'test' }})
			.expect(403, done)
		 
	})

	it('Test scenario 2', function(done) {

		session
			.post('/api/tweets')
			.send({ tweet: { text: 'Test Tweet' } })
			.expect(200)
			.end(function(err, response) {
				if(err) {
					return done(err)
				}
				try {
					expect(response.body).to.have.property('tweet')
					done(null)
				} catch (err) {
					done(err)
				}
			})
	})
})