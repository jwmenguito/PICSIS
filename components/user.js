var mongoose = require('mongoose');
var schema = mongoose.Schema;

module.exports = mongoose.model('user',new schema({
	name:String,
	password:String,
	type:String,
	admin:Boolean
}));