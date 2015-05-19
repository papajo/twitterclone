var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var tweetSchema = new Schema({
  userId: String,
  created: { type: Number},
  text: String
  
  tweetSchema.methods.toClient = function (tweet) {
  	return this.model('Tweet').toObject({ versionKey: true }, tweet)
  }

});

module.exports = tweetSchema;