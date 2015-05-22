var ensureAuthentication = require('./ensureAuthentication')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , passport = require('../auth')
  , bodyParser = require('body-parser')

module.exports = function(app) {

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Load cookieParser
app.use(cookieParser());

//Load the session middleware 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

//load the passport.initialize() and passport.session() middleware 
app.use(passport.initialize());
app.use(passport.session());

};