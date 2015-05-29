var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  id:  { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
  followingIds: { type: [String], default: []}
});

userSchema.pre('save', function(next) {
// get encrypted value of this.password
// assign encrypted value to this.password
// call next() when you're done
	var user = this;
	if (!user.isModified('password')) { return next() }
	bcrypt.hash(user.password, 10, function(err, hash) {
		if(err) { return next(err) }
		user.password = hash;	
		next();
	});	
	
});

userSchema.methods.toClient = function() {
	
	var secureUser = {
     	id: this.id,
		name: this.name
	};
	return secureUser;
}

userSchema.statics.findByUserId = function(id, done) {
	this.model('User').findOne({ id: id }, done)
}
userSchema.methods.findTweetsById = function(id, done) {
	this.model('Tweet').find({ TweetId: TweetId }, done)
}

userSchema.methods.follow = function(userId, done) {
	var update = { $addToSet: { followingIds: userId } }
	this.model('User').findByIdAndUpdate(this._id, update, done)
}
	
userSchema.methods.unfollow = function(userId, done) {
	var update = { $pull: { followingIds: userId } }
	this.model('User').findOneAndUpdate(this._id, update, done)
}	

userSchema.methods.findFriends = function(done) {
	this.model('User').find({ id: { $in: this.followingIds }}, done)
}

userSchema.methods.findFollowers = function(done) {
	this.model('User').find({ followingIds: { $in: [this.id] }}, done )
}


module.exports = userSchema;