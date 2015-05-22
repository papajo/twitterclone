var express = require('express')
  , router = express.Router()
  , connect = require('../../db')
  , passport = require('../../auth')
  , ensureAuthentication = require('../../middleware/ensureAuthentication')

//Authetication Route
router.post('/api/auth/login', 
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

//POST Logout /api/auth.logout
router.post('/api/auth/logout', function(req, res){
    req.logout(); 
    res.sendStatus(200);
      
});

module.exports = router;