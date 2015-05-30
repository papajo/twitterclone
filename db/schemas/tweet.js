var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var tweetSchema = new Schema({
  userId: String,
  created: { type: Number},
  text: String

});
tweetSchema.methods.toClient = function() {
  var tweet = 	{
     				id: this._id,
     				userId: this.userId,
     				created: this.created,
     				text: this.text
  				}
  return tweet
}

tweetSchema.methods.findTweetsById = function(id, done) {
  this.model('Tweet').find({ userId: userId }, done)
}

module.exports = tweetSchema;