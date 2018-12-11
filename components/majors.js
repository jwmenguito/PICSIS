var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var MajorSchema = new Schema ({
	_id:Schema.Types.ObjectId,
    degree_id:String,
    degree_name:String
});

module.exports = mongoose.model('Majors',MajorSchema,"major-degree");
