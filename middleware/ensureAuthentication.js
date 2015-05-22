module.exports = function ensureAuthentication(req, res, next) {

	  if (req.isAuthenticated()) {
	  	res.sendStatus(200);
	    return next();
	  }
	  res.sendStatus(403);
	}

