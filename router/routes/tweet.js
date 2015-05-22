var express = require('express')
  , router = express.Router()
  , ensureAuthentication = require('../../middleware/ensureAuthentication')

//GET /api/tweets route
router.get('/api/tweets', function(req, res) {
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

//GET /api/tweets/:tweetId
router.get('/api/tweets/:tweetId', function(req, res) {
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
});

//POST /api/tweets
router.post('/api/tweets', ensureAuthentication, function(req, resp) {
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
router.delete('/api/tweets/:tweetId', ensureAuthentication, function(req, res) {
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

module.exports = router;