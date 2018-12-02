var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CurriculumSchema = new Schema ({
	_id:Schema.Types.ObjectId,
	degree:String,
	major_degree:String,
	total_units:Number,
	terms:Array
});

module.exports = mongoose.model('Curriculum',CurriculumSchema,'curriculum');