var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var FeeRefSchema = new Schema ({
	_id:Schema.Types.ObjectId,
	degree:String,
	selection:Number,
	entrance:Number,
	id:Number,
	misc:Number,
	tuition:Number
});

module.exports = mongoose.model('FeeRef',FeeRefSchema,"fee_reference");