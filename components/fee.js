var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var FeeSchema = new Schema ({
	_id:Schema.Types.ObjectId,
	student:{type:Schema.Types.ObjectId, ref:'Student'},
	term:Number,
	degree:String,
	selection:Number,
	entrance:Number,
	id:Number,
	misc:Number,
	year:Number,
	tuition:Number,
	status:String
});

module.exports = mongoose.model('Fee',FeeSchema,"fees");