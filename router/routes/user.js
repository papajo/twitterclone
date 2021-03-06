var express = require('express')
  , router = express.Router()
  , connect = require('../../db')
  , ensureAuthentication = require('../../middleware/ensureAuthentication')

// //Route GET /api/users/:userId
// //http://127.0.0.1:3000/api/users/billgates
router.get('/:userId', function (req, res) {
  console.log(req.route);
    //task 26-1
    var User = connect.model('User')
    User.findOne({ id: req.params.userId }, function(err, user) {
    if (err) {
      return res.sendStatus(500)
    }
    if (!user) {
      return res.sendStatus(404)
    }
    return res.send({ user: user.toClient() })
    });

  });

//POST /api/users
router.post('/', function (req, res) {
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
                 return res.sendStatus(409);
          }
        }
        //successful validation, save user and authenticate
        req.login(user, function(err){
          if (err) return res.sendStatus(500);
          return res.sendStatus(200);
        });
    });
    
});

router.put('/:userId', ensureAuthentication, function(req, res) {
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

router.post('/:userId/follow', ensureAuthentication, function(req, res) {
    console.log(req.route);

    var User = connect.model('User')
      , userId = req.params.userId
      
    User.findByUserId(userId, function(err, user) {
        if (err) { 
            return res.sendStatus(500)
        }
        if (!user) { 
            return res.sendStatus(403)
        }
        req.user.follow(userId, function(err) {
            if (err) {
                return res.sendStatus(500)
            }
        res.sendStatus(200)
        })  
    })
});

router.post('/:userId/unfollow', ensureAuthentication, function(req, res) {
    console.log(req.route);

    var User = connect.model('User')
      , userId = req.params.userId

    User.findByUserId(userId, function(err, user) {
        if (err) { return res.sendStatus(500) }
        if (!user) { return res.sendStatus(403) }
        req.user.unfollow(userId, function(err) {
          if (err) { return res.sendStatus(500) }
        res.sendStatus(200)
        })
    })
});

router.get('/:userId/friends', function(req, res) {
    console.log(req.route);

    var User = connect.model('User')
      , userId = req.params.userId

    User.findByUserId(userId, function(err, user) {
        if(err) { return sendStatus(500) }
        if (!user) { return res.sendStatus(404) }
        user.findFriends(function(err, friends) {
            if (err) { return res.sendStatus(500) }
        var friendsList = friends.map(function(user) { return user.toClient() })      
        res.send({ users: friendsList })
        })
    })
});

router.get('/:userId/followers', function(req, res) {
    console.log(req.route)

    var User = connect.model('User')
      , userId = req.params.userId

    User.findByUserId(userId, function(err, user) {
        if(err) { return sendStatus(500) }
        if (!user) { return res.sendStatus(404) }
        user.findFollowers(function(err, followers) {
            if (err) { return res.sendStatus(500) }
        var followersList = followers.map(function(user) { return user.toClient() })      
        res.send({ users: followersList })
        })
    })      

});

module.exports = router;