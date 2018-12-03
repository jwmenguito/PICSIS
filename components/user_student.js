var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var reminderSchema = new Schema({
	title:String,
	message:String
});
var studentSchema = new Schema({
	student_no:String,
	email:String,
	fname:String,
	lname:String,
	mname:String,
	mobile:Number,
	course:String,
	term:Number,
	status:String,
	major_degree:String,
	checklist:Array,
	hash: String,
	salt: String,
	reminders:Array,
	fees:[{type:Schema.Types.ObjectId, ref:'Fee'}]
});

studentSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return;
	}
studentSchema.methods.validatePassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

module.exports = mongoose.model('Student',studentSchema);