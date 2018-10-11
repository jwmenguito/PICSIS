var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var facultySchema = new Schema({

	email:String,
	fname:String,
	lname:String,
	prof_id:String,
	degree:String,
	major:String,
	gender:String,
	hash: String,
	salt: String

});	
facultySchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}
facultySchema.methods.validatePassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

module.exports = mongoose.model('Faculty',facultySchema,'faculty');