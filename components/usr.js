var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var userSchema = new Schema({

	email:String,
	hash: String,
	salt: String,
	type: String

});	
userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}
userSchema.methods.validatePassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

module.exports = mongoose.model('Usr',userSchema,'userCollection');