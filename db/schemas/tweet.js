var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var tweetSchema = new Schema({
  userId: String,
  created: { type: Number},
  text: String
  
});

module.exports = tweetSchema;