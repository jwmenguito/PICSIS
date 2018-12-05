var mongoose = require('mongoose');
var schema = mongoose.Schema;

var ClassesSchema = new schema({
	subject_code:String,
	//subj_desc:String,
	section:String,
	units:Number,
	prof_id:{type:schema.Types.ObjectId},
	term:Number,
	degree:String,
	major_degree:String,
	student_ids:[{type: schema.Types.ObjectId}]
 	
},{ toJSON: { virtuals: true }, toObject: { virtuals: true }});

ClassesSchema.virtual('students',{
	ref:'Student',
	localField:'student_ids',
	foreignField:'student_no',
    	
});

ClassesSchema.virtual('professor',{
    ref:'Faculty',
    localField:'prof_id',
    foreignField:'prof_id',
    justOne:true
});

module.exports = mongoose.model('Classes',ClassesSchema,'classes');
