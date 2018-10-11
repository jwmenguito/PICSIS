var mongoose = require('mongoose');
var schema = mongoose.Schema;
var SubjectSchema = new schema({
	subject_code:String,
	subj_desc:String,
	units:Number,
	prof_id:String,
	major_degree:String,
 	
},{ toJSON: { virtuals: true }, toObject: { virtuals: true }});

SubjectSchema.virtual('students',{
	ref:'Student',
	localField:'subject_code',
	foreignField:'checklist.subject_code',
    	
});

module.exports = mongoose.model('Subjects',SubjectSchema,'subjects');