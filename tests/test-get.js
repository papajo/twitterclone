var request = require('supertest')
  , express = require('express')

var app = express();

process.env.NODE_ENV = 'test'

describe('GET /api/tweets/55231d90f4d19b49441c9cb9', function() {
	it('recieve back status code 404', function(done) {
		request(app)
			.get('/api/tweets/55231d90f4d19b49441c9cb9')
			.expect(404)
			.end(function(err, res) {
				if(err) return done(err)
				if(200) return done(err)
			});
	})
})