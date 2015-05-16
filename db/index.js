var mongoose = require('mongoose')
  , config = require('../config');
var userSchema = require('./schemas/user')
  , tweetSchema = require('./schemas/tweet');

var connection = mongoose.createConnection(
    config.get('database:host')
  , config.get('database:name')
  , config.get('database:port'));


connection.model('User', userSchema);
connection.model('Tweet', tweetSchema);



module.exports = connection;