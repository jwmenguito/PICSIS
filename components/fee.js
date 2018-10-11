var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var FeeSchema = new Schema ({
	_id:Schema.Types.ObjectId,
	student:{type:Schema.Types.ObjectId, ref:'Student'},
	term:Number,
	amount:Number,
	receipt:String
});

module.exports = mongoose.model('Fee',FeeSchema);