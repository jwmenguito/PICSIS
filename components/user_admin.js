var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var adminSchema = new Schema({
	admin_id:String,
	email:String,
	hash: String,
	salt: String
	
})
adminSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};
adminSchema.methods.validatePassword = function(password){
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

module.exports = mongoose.model('admin',adminSchema,'admin');