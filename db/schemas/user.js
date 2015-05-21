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
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err) { return next(err) }
		user.password = hash;	
		next();
	});	
	
});

module.exports = userSchema;