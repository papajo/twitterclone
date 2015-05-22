//var ensureAuthentication = require('./middleware/ensureAuthentication');

//
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
app.use(bodyParser.json())

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

	//POST /api/tweets
	app.post('/api/tweets', ensureAuthentication, function(req, resp) {
	  console.log('BODY:', req.body);
	  //task-27
	  var Tweet = connect.model('Tweet')
	  var createTime = (new Date().getTime())/1000 | 0;
	  
	  var newTweet = new Tweet ({
	                                text: req.body.tweet.text,
	                                created: createTime,
	                                userId: req.user.id,
	                                __v: 0
	                              })
	  newTweet.save(function(err, tweet) {
	    if (err) return resp.send(err)
	  })
	  return resp.send({ tweet: newTweet.toClient() })
	  
	});

	//DELETE /api/tweets/:tweetId
	app.delete('/api/tweets/:tweetId', ensureAuthentication, function(req, res) {
	    console.log(req.route);
	    
	      var Tweet = connect.model('Tweet')
	    , tweetId = req.params.tweetId
	 
	    Tweet.findById(tweetId, function(err, tweet) {
	      if (err) {
	        return res.sendStatus(500)
	      }
	   
	      if (!tweet) {
	        return res.sendStatus(404)
	      }
	   
	      if (tweet.userId !== req.user.id) {
	        return res.sendStatus(403)
	      }
	   
	      Tweet.findByIdAndRemove(tweet._id, function(err) {
	        if (err) {
	          return res.sendStatus(500)
	        }
	        res.sendStatus(200)
	      })
	    })
	    
	});

}