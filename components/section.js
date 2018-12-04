var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SectionSchema = new Schema ({
	_id:Schema.Types.ObjectId,
	name:String
});

module.exports = mongoose.model('Section',SectionSchema,"sections");
