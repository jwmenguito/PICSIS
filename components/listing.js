var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ListingSchema = new schema({
	term:Number,
	subject_code:String,
	subj_desc:String,
	units:Number,
	degree:String,
	major_degree:String,
 	students:Array
});


module.exports = mongoose.model('Listing',ListingSchema,'listing');
