var express = require('express');
var bodyParser = require('body-parser');
var fixtures = require('./fixtures');
var shortId = require('shortid');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('./auth');
var app = express();
var config = require('./config');
var connect = require('./db');



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

app.get('/', function (req, resp) {
  resp.send('Hello World!');
});

//Authetication Route
app.post('/api/auth/login', 
  function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      console.log('500');
      return res.sendStatus(500); 
    }
    if (!user) { 
      console.log('403');
      return res.sendStatus(403);
      //return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { 
        console.log('err');
        return next(err); //not sure what this should be set to?
      }
      console.log('all good');
      return res.send({user: user});
      //return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});

// middleware implementation
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(403);
}

//GET /api/tweets route
app.get('/api/tweets', function (req, resp) {
  console.log(req.route);
var tweets = [];
if(!req.query.userId){
  	return resp.sendStatus(400)
  }
  else
  {
  	for (var i=0; i < fixtures.tweets.length; i++){
  		//console.log(fixtures.tweets[i]);
  		if (fixtures.tweets[i].userId == req.query.userId){
  			tweets.push(fixtures.tweets[i]);	
  		}
  	}
  	var sortedTweets = tweets.sort(function(a, b) {
  		return b.created - a.created
  	});

  	resp.send({tweets: sortedTweets});
  }

  });

//Route GET /api/users/:userId
//http://127.0.0.1:3000/api/users/billgates

app.get('/api/users/:userId', function (req, resp) {
  console.log(req.route);
    //task 26-1
    var User = connect.model('User')
    User.findOne({ id: req.params.userId }, function(err, user) {
    if (err) {
      return resp.sendStatus(500)
    }
    if (!user) {
      return resp.sendStatus(404)
    }
    return resp.send({ user: user })
    });

  });

app.put('/api/users/:userId', ensureAuthentication, function(req, res) {
  console.log(req.route)
  //task 26-2
  var User = connect.model('User')

    , query = { id: req.params.userId }
    , update = { password: req.body.password }
 
  if (req.user.id !== req.params.userId) {
    return res.sendStatus(403)
  }
  User.findOneAndUpdate(query, update, function(err, user) {
    if (err) {
      return res.sendStatus(500)
    }
    res.sendStatus(200)
  })
});

app.use(bodyParser());
//POST /api/users
app.post('/api/users', function (req, resp) {
    console.log('BODY:', req.body)
    
    req.body.user.followingIds = [];
    //task23
    var User = connect.model('User');
    var newUser = new User(
            { 
              id: req.body.user.id,
              name: req.body.user.name,
              email: req.body.user.email,
              password: req.body.user.password,
              followingIds: req.body.user.followingIds
            });
    newUser.save(function(err, user) {
        if (err) {
          if (err.code === 11000) {
              //Duplicate condition
                 return resp.sendStatus(409);
          }
        }
        //successful validation, save user and authenticate
        req.login(user, function(err){
          if (err) return resp.sendStatus(500);
          return resp.sendStatus(200);
        });
    });
    
});

//POST /api/tweets
app.post('/api/tweets', ensureAuthentication, function(req, resp) {
  console.log('BODY:', req.body);

  var autoId = shortId.generate();
  var createTime = (new Date().getTime())/1000 | 0;
  
  var newTweet = {
    id: autoId,
    text: req.body.tweet.text,
    created: createTime,
    userId: req.user.id
  }
  fixtures.tweets.push(newTweet);
  
  resp.send({tweet: newTweet});
  
});

//GET /api/tweets/:tweetId
app.get('/api/tweets/:tweetId', function(req, resp) {
    console.log(req.route);

    for (var i = 0; i < fixtures.tweets.length; i++){
      if (fixtures.tweets[i].id == req.params.tweetId){
          return resp.send({tweet: fixtures.tweets[i]});
      }
    }
     resp.sendStatus(404);

});

//DELETE /api/tweets/:tweetId
app.delete('/api/tweets/:tweetId', ensureAuthentication, function(req, resp) {
    console.log(req.route);

    for (var i = 0; i < fixtures.tweets.length; i++){
      if (fixtures.tweets[i].id == req.params.tweetId){
          if (fixtures.tweets[i].userId !== req.user.id) {
              return resp.sendStatus(403);
          }
          fixtures.tweets.splice(i, 1);
          return resp.sendStatus(200);
      }
    }
     resp.sendStatus(404);

});

//POST Logout /api/auth.logout
app.post('/api/auth/logout', function(req, resp){
    req.logout(); 
    resp.sendStatus(200);
      
});


var server = app.listen(config.get('server:port'),config.get('server:host'), function () {
//for debugging only -
//http://requestb.in/14oojqk1 from POSTMAN
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('app is listening at http://%s:%s', host, port);
  
});
module.exports = server;

