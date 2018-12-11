var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var DegreeSchema = new Schema ({
	_id:Schema.Types.ObjectId,
    course_id:String,
    course_name:String
});

module.exports = mongoose.model('Degrees',DegreeSchema,"degrees");
