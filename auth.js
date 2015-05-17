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
  //task 25
  function(username, password, done) {
    User.findOne({ id: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

 
module.exports = passport;