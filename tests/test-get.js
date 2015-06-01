var request = require('supertest')
  , express = require('express')

var app = require('../index');

process.env.NODE_ENV = 'test'

describe('GET route', function() { 
	it('expect to recieve server status code 404', function(done) { 
		request(app) 
		.get('/api/tweets/55231d90f4d19b49441c9cb9') 
		.expect(404, done) 
		
	}) 
})