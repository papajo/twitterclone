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
  
  	// for (var i = 0; i < fixtures.users.length; i++){
  	// 	console.log(fixtures.users[i].id);
  	// 	if (fixtures.users[i].id == id){
  	// 		return done (null, fixtures.users[i]);
  	// 	} 	
  	// }
    //task 24
    User.findOne({ }, 'id', function(err, id) { });
    if (err) return resp.sendStatus(500);
  	sendStatus(200);
    return done (null, false);
   
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