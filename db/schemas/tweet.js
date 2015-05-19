var mongoose = require('mongoose');
var tweetSchema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

tweetSchema.methods.toClient = function() {
  var tweet = 	{
      				id: this._id,
     				userId: this.userId,
     				created: this.created,
     				text: this.text
  			  	}
  return tweet
}

module.exports = tweetSchema;