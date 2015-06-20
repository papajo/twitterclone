//This application uses express as it's web server
var express = require('express');
// var bodyParser = require('body-parser');
// var fixtures = require('./fixtures');
// var shortId = require('shortid');
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var passport = require('./auth');
 var config = require('./config');
//var connect = require('./db');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server with middleware authentication
var ensureAuthentication = require('./middleware/ensureAuthentication')
  , app = express();
require('./middleware')(app);
require('./router')(app);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// app.get('/', function (req, resp) {
//    resp.send('Welcome to Twitter Clone! Please Login');
// });

var server = app.listen(appEnv.port, appEnv.bind, function() {
	console.log("Server Starting On..." + appEnv.url);
});

/* commenting for bluemix testing
var server = app.listen(config.get('server:port'),config.get('server:host'), function () {
//for debugging only -
//http://requestb.in/14oojqk1 from POSTMAN
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('app is listening at http://%s:%s', host, port);
  
});
*/
module.exports = server;

