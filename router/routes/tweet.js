var express = require('express')
  , router = express.Router()
  , connect = require('../../db')
  , ensureAuthentication = require('../../middleware/ensureAuthentication')

//GET /api/tweets route
router.get('/', ensureAuthentication, function(req, res) {
  // if (!req.query.userId || !req.query.stream) {
  //   return res.sendStatus(400)
  // }
 
  var Tweet = connect.model('Tweet')
    , stream = req.query.stream
    , userId = req.query.userId
    , options = { sort: { created: -1 } }
    , query = null
    
  if (stream === 'home_timeline') {
      query = { userId: { $in: req.user.followingIds }}
  } else if (stream === 'profile_timeline' && userId ) {
      query = { userId: userId }
  } else {
      return res.sendStatus(400)
  }
 
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
router.get('/:tweetId', function(req, res) {
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
router.post('/', ensureAuthentication, function(req, res) {
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
	  if (err) return res.send(err)
})
return res.send({ tweet: newTweet.toClient() })

});

//DELETE /api/tweets/:tweetId
router.delete('/:tweetId', ensureAuthentication, function(req, res) {
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