var passport = require('passport');
var fixtures = require('./fixtures');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var userSchema = require('./db/schemas/user');

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
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' })
    }
    bcrypt.compare(password, user.password, function(err, matched) {
      if (err) {
        return done(err)
      }
      matched ? done(null, user)
              : done(null, false, { message: 'Incorrect password.' })
    })
  });
  }));
     
module.exports = passport;