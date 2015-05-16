var passport = require('passport');
var fixtures = require('./fixtures');
var bodyParser = require('body-parser');

var LocalStrategy = require('passport-local').Strategy;

var conn = require('./db')
  , User = conn.model('User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  
    //task 24
    User.findOne({ 'id': id }, function(err, user) { 
          return done (err, user);
    });
   
});

passport.use(new LocalStrategy(
	function (username, password, done){
	for (var i = 0; i < fixtures.users.length; i++){
  		
  		if (fixtures.users[i].id == username){
  			if (fixtures.users[i].password == password){
  				return done (null, fixtures.users[i]);
  			} 
  			else {
  				return done (null, false, {message: 'Incorrect password.'})
  			}
  		} 
  	}
  	return done (null, false, {message: 'Incorrect username.'});

})
);

 
module.exports = passport;