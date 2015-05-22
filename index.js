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

var ensureAuthentication = require('./middleware/ensureAuthentication');



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

//GET /api/tweets route
app.get('/api/tweets', function(req, res) {
  if (!req.query.userId) {
    return res.sendStatus(400)
  }
 
  var Tweet = connect.model('Tweet')
    , query = { userId: req.query.userId }
    , options = { sort: { created: -1 } }
 
  Tweet.find(query, null, options, function(err, tweets) {
    if (err) {
      return res.sendStatus(500)
    }
    var responseTweets = tweets.map(function(tweet) { 
      return tweet.toClient() 
    })
    res.send({ tweets: responseTweets })
  })
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

//GET /api/tweets/:tweetId
app.get('/api/tweets/:tweetId', function(req, res) {
  var Tweet = connect.model('Tweet')
  Tweet.findById(req.params.tweetId, function(err, tweet) {
    if (err) {
      return res.sendStatus(500)
    }
    if (!tweet) {
      return res.sendStatus(404)
    }
    res.send({ tweet: tweet.toClient() })
  })
})



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

