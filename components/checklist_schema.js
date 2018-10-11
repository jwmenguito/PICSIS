var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Student = require('user_student.js');
var classes = require('classes.js');
var Faculty =  require('user_faculty.js');

var classesSchema = new Schema({
	id: Schema.Types.ObjectId,
	classes:[classes],
	grade:String
	
})
var checkListSchema = new Schema({
	student_id:{type:Schema.Types.ObjectId, ref:Student},
	classes : [classesSchema]
	
})