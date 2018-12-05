'use strict'
var path = require('path');
var Faculty = require(__dirname+'/../user_faculty');	//mongoose user
var Subjects = require(__dirname+'/../subjects');
var Student = require(__dirname+'/../user_student');
var admin = require(__dirname+'/../user_admin');
var Usr = require(__dirname+'/../usr');

var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var cookieExtractor = require(__dirname+'/../../config/cookieExtractor');

var FeeRef = require(__dirname+'/../fee_ref');
var Curriculum = require(__dirname+'/../curriculum');
var Fees = require(__dirname+'/../fee');
var Listing = require(__dirname+'/../listing');
var Classes = require(__dirname+'/../classes');

//Admin Home
exports.admin_home = (req,res) =>{
	console.log("HELLO WORLD! ADMIN!!!");
	
	var token = cookieExtractor(req);
		//decode token
		if(token){
			
			//verifies ticket and checks expiration
			jwt.verify(token,req.app.get('terces'),function(err,decoded){
				if(err){
						
					console.log("Error");
				
				}else{
						req.decoded = decoded
				}
			});
			
		}else{
			//if there is no token
			//return error
			console.log("Token not found");
			return res.status(401).sendFile(path.join(__dirname + '/../../login.html'));
		}
	
		console.log("Finding in database");	
		admin.findOne({email:req.decoded.email},
		function(err,userFound){
			if(err) throw err;
			
			if(!userFound){
				console.log("User not found");
				return res.status(403).sendFile(path.join(__dirname + '/../../login.html'));
				
			}else if(userFound){
				//return res.send(userFound);
				console.log(userFound);
				
				res.cookie('user',userFound.email);
				return res.status(200).sendFile(path.join(__dirname + '/../../home.html'));  
			}
			
		});
}

//Admin Records
exports.admin_records = (req,res) =>{
	res.status(200).sendFile(path.join(__dirname + '/../../home.html')); 
}

//Admin Get Records
exports.admin_get_records = (req,res) => {
		console.log("GET");
	if(req.body.table==='subject'){
		Subjects.find({}).sort({subject_code:1}).exec(function(err,docs){
			if(err) throw err;
			if(!docs){
				console.log(docs);
				return  res.json({message:"Unsuccessful"});
			}
			if(docs){
				console.log(docs);				
				return res.json(docs);
			}
		});
	}else if(req.body.table ==='student'){
		Student.find({}).populate('fees').sort({lname:1}).exec(function(err,docs){
			if(err) throw err;
			if(!docs){ 
				return res.json({message:"Unsuccessful"});
			}
			if(docs){ 
			console.log(docs);
				return res.json(docs);
			}
		});
	}else if(req.body.table==='faculty'){
		Faculty.find({}).sort({lname:1}).exec(function(err,docs){
			if(err) throw err;
			if(!docs){
				console.log(docs);
				return  res.json({message:"Unsuccessful"});
			}
			if(docs) {
				console.log(docs);
				return res.json(docs);
			}
		});
	}else{
		return  res.json({message:"Unsuccessful"});
	}
}



//Admin ADD students
exports.admin_add_student = (req,res) => {
	console.log(req.body);
	var student = new Student(req.body);
	var checklist = {
			student_no: "",
			subjects : []
	}
	// initialize fee
	var fee = {
		
		id:0,
		misc:0,
		selection:0,
		entrance:0,
		tuition:0
	}
	
	FeeRef.findOne({"degree":req.body.course}).exec(function(err,doc){
		if(err) throw err;
		if(doc) {
			fee = doc;
		}
	});
	
	Curriculum.findOne({major_degree:req.body.major_degree,degree:req.body.course}).exec(function(err,docs){
		console.log(req.body.major_degree);
		console.log(req.body.major_degree);
		console.log(req.body.major_degree);
		if(err) throw err;
		if(!docs) console.log ("Error, no match found for degree.");
		if(docs) {
			console.log(docs);
			//for each term
			for(var x=0; x<docs.terms.length;x++){
				//get term
				var term = {
					
					term: docs.terms[x].term,
					units: docs.terms[x].units,
					subjects:[]
					
				}
				
				for(var y=0;y<docs.terms[x].subjects.length;y++){
					
					var subject = {
						subject_code: docs.terms[x].subjects[y].subject_code,
						subj_desc: docs.terms[x].subjects[y].subj_desc,
						units: docs.terms[x].subjects[y].units,
						grade: '-'
					}
					
					term.subjects.push(subject);
				}
				//add term to checklist
				student.checklist.push(term);
			}

			//Create Student Fee
			var today = new Date();
			student._id = new mongoose.Types.ObjectId();
			var student_fee = {
				_id:new mongoose.Types.ObjectId(),
				student:student._id,
				selection: fee.selection,
				entrance: fee.entrance,
				id: fee.id,
				misc: fee.misc,
				tuition: fee.tuition,
				term:1,
				year: today.getFullYear(),
				status:"PAID"
			}
			
			//Create new Fee entity
			var new_fee = new Fees(student_fee);
			console.log(student_fee);
			
			//Push fee to student.fees array
			student.fees.push(student_fee);
			console.log(student);
			
			//Create student password
			student.setPassword(student.lname);
			
			//Save fee to database
			new_fee.save(function(err){
				if(err) return res.json({message:"Fee not saved."});
			});
			
			//save student
			student.save(function(err){
				if(err) return res.json({message:'Student not saved'});
			});	
			
			//create user
			var usr = {
				email: student.email,
				hash:student.hash,
				salt:student.salt,
				type:"s"
			}
			console.log(usr);
			console.log(usr);
			
			var new_usr = new Usr(usr);
			
			new_usr.save(function(err){
				if(err) return res.json({message:'Cannot create account'});
				else return res.json({message:'Student Account created successfully'});
				
				
			});
			
		
			
	}
})

}

exports.admin_add_subject = (req,res) => {
	var subject = new Subjects(req.body);
	subject._id = new mongoose.Types.ObjectId();
	console.log(subject);
	subject.save(function(err,subject){
		if(err) throw err;
		else console.log("Adding new subject:\n"+subject);
	});
	return res.json({message:"New subject added"});
}

exports.admin_add_faculty = (req,res) => {
	var faculty = new Faculty(req.body);
	faculty._id = new mongoose.Types.ObjectId();
	faculty.save(function(err,faculty){
		if(err) throw errl
		else console.log("Adding new faculty member:\n"+faculty);
	});
	return res.json({message:"New faculty added"});
}

exports.admin_edit_faculty = (req,res) => {
	var selected = req.body.selected_field;
	var value = req.body.value;
		var update = {};
	update[selected]=value;
	console.log("Edit Faculty");
	console.log("Selected: "+selected);
	console.log("Change to: "+value);
	
	Faculty.updateOne({prof_id:req.body.prof_id},{$set:update},function(err,doc){
		if(err) throw err;
		if(!doc) return res.json({message:"No document found"});
		else {
			console.log(doc);
			return res.json({message:"Document updated!"});
		}
	})
}

exports.admin_edit_student = (req,res) => {
	var selected = req.body.selected_field;
	var value = req.body.value;
	var update = {};
	update[selected]=value;
	
	console.log("Edit Student");
	console.log("Selected: "+selected);
	console.log("Change to: "+value);
	console.log(update[selected]);
	Student.updateOne({student_no:req.body.student_no},{$set:update},function(err,doc){
		if(err) throw err;
		if(!doc) return res.json({message:"No document found"});
		else {
			console.log(doc)
			return res.json({message:"Document updated!"});
		}
	})
}

exports.admin_edit_subject = (req,res) => {
	var selected = req.body.selected_field;
	var value = req.body.value;
		var update = {};
	update[selected]=value;
	Subjects.updateOne({subject_code:req.body.subject_code},{$set:update},function(err,doc){
		if(err) throw err;
		if(!doc) return res.json({message:"No document found"});
		else {
			console.log(doc)
			return res.json({message:"Document updated!"});
		}
	})
}

exports.admin_archive = (req,res) =>{
	
	var month = new Date().getMonth();
	var year = new Date().getFullYear();
	
	if(req.body.collection=='student'){
		var archiveDb = mongoose.createConnection('mongodb://james:123qwe@ds159670.mlab.com:59670/heroku_9t8tj7k2');
		archiveDb.createCollection('studentArchive'+month+year).then(function(err,collection){
			if(err) throw err;
		});
		var studArchive = archiveDb.collection('studentArchive'+month+year);
		Student.find({}).sort({lname:1}).exec(function(err,docs){
			if(err) throw err;
			if(!docs) return res.json({message:'Something went wrong...'});
			if(docs){
				studArchive.insertMany(docs,function(err,docs){
					if(err) throw err;
				});
			};
		
		})
		
	}else if(req.body.collection=='listing'){
		var archiveDb = mongoose.createConnection('mmongodb://james:123qwe@ds159670.mlab.com:59670/heroku_9t8tj7k2');
		archiveDb.createCollection('listingArchive'+month+year).then(function(err,collection){
			if(err) throw err;
		});
		var listingArchive = archiveDb.collection('listingArchive'+month+year);
	    Listing.find({}).sort({term:1,subject_code:1}).exec(function(err,docs){
			if(err) throw err;
			if(!docs) return res.json({message:'Something went wrong...'});
			if(docs){
				listingArchive.insertMany(docs,function(err,docs){
					if(err) throw err;
				});
			};
		
		})
	}else if(req.body.collection=='faculty'){
		var archiveDb = mongoose.createConnection('mongodb://james:123qwe@ds159670.mlab.com:59670/heroku_9t8tj7k2');
		archiveDb.createCollection('facultyArchive'+month+year).then(function(err,collection){
			if(err) throw err;
		});
		var facultyArchive = archiveDb.collection('facultyArchive'+month+year);
		Faculty.find({}).sort({lname:1}).exec(function(err,docs){
			if(err) throw err;
			if(!docs) return res.json({message:'Something went wrong...'});
			if(docs){
				facultyArchive.insertMany(docs,function(err,docs){
					if(err) throw err;
				});
			};
		
		})
	}
	
	return res.json({message:"Finished"});
}
//ENROLLING
exports.admin_listing_enroll = (req,res) => {
      
    Student.find({status:"ENROLLED"}).sort({lname:1}).exec(function(err,docs){
        if(err) throw err;
        if(!docs) return res.json({message:'Something went wrong...'});
        if(docs){
            //Get all ENROLLED students
            //Get their current student.term
            //Get student_no
            console.log("Found "+docs.length+" students with status ENROLLED");

            for(var x=0;x<docs.length;x++){
                var curr_term = docs[x].term;    
                var std = docs[x].student_no;
                var course = docs[x].course;
                var major_degree = docs[x].major_degree;
                
                //find in listing
                //add to listing		    
                Listing.update({"term":curr_term,"degree":course,"major_degree":major_degree},{$push:{students:std}},{multi:true},
                
                function(err,doc){
                    console.log(doc);
                    if(err) throw err;
                    if(doc) res.json({message:"Listing of student number " + std +" success! Inserted in "+doc.nModified+" subjects"});
                    else res.json({message:"Failed listing of student number " + std});
                });
           }	
      }

    });


	
}


exports.admin_listing_clear = (req,res) => {
     console.log(req.body);                
     
     Listing.update({},{$set:{students:[]}},{multi:true},function(err,doc){
        console.log(doc);
	    if(err) throw err;
	    if(doc) res.json({message:"Cleared Listing: "+doc.nModified+" subjects"});
	    else res.json({message:"Failed to empty listing"});
     });
             
}


//ADD ONE STUDENT TO A SUBJECT
exports.admin_listing_add = (req,res) => {
	 console.log(req.body);
	var curr_term = req.body.term;
    var std = req.body.student_no;
    var course = req.body.course;
    var major_degree = req.body.major_degree;  
    var subject_code = req.body.subject_code;
	
    Listing.update({"term":curr_term,"degree":course,"major_degree":major_degree, "subject_code":subject_code},{$push:{students:std}},
    
    function(err,doc){
        console.log(doc);
        if(err) throw err;
        if(doc) res.json({message:"Listing of student number " + std +" success! Inserted in "+doc.nModified+" subjects"});
        else res.json({message:"Failed listing of student number " + std});
    });
	
}


//ADD ONE STUDENT TO ALL SUBJECTS
exports.admin_listing_add_all = (req,res) => {
      console.log(req.body);
     var curr_term = req.body.term;
     var std = req.body.student_no;
     var course = req.body.course;
     var major_degree = req.body.major_degree;  
     
      Listing.update({"term":curr_term,"degree":course,"major_degree":major_degree},{$push:{students:std}},{multi:true},function(err,doc){
            console.log(doc);
		    if(err) throw err;
		    if(doc) res.json({message:"ADDED STUDENT NUMBER" + std +" TO "+doc.nModified+" subjects"});
		    else res.json({message:"Failed to remove from listing student number " + std});
      });
}


//REMOVE ONE STUDENT FROM A SUBJECT
exports.admin_listing_remove = (req,res) => {
     console.log(req.body);
     var std = [];
     std.push(req.body.student_no);

       
       Listing.find({term:req.body.term,degree:req.body.course,major_degree:req.body.major_degree,subject_code:req.body.subject_code}).exec
       
       (function(err,docs){
        if(err) throw err;
        if(!docs) console.log("Empty");
        if(docs) console.log(docs);
      }); 
      Listing.update({term:req.body.term,degree:req.body.course,major_degree:req.body.major_degree,subject_code:req.body.subject_code},{$pullAll:{students:std}},{multi:true},function(err,doc){
            //console.log(doc);
		    if(err) throw err;
		    if(doc) res.json({message:"REMOVED from listing student number " + std +" from "+doc.nModified+" subject(s)"});
		    else res.json({message:"Failed to remove from listing student number " + std});
      });
}



//REMOVE ONE STUDENT TO ALL SUBJECTS OF TERM, COURSE, MAJOR
exports.admin_listing_remove_all = (req,res) => {
      console.log(req.body);
     
     var std = [];
     std.push(req.body.student_no);

       
     Listing.find({term:req.body.term,degree:req.body.course,major_degree:req.body.major_degree,subject_code:req.body.subject_code}).exec(function(err,docs){
        if(err) throw err;
        if(!docs) console.log("Empty");
        if(docs) console.log(docs);
      }); 
       
     
      Listing.update({term:req.body.term,degree:req.body.course,major_degree:req.body.major_degree},{$pullAll:{students:std}},{multi:true},function(err,doc){
            //console.log(doc);
		    if(err) throw err;
		    if(doc) res.json({message:"REMOVED from listing student number " + std +" from "+doc.nModified+" subjects"});
		    else res.json({message:"Failed to remove from listing student number " + std});
      });
}

exports.admin_term_sections = (req,res) => {

    //create sections
    var counter = 0;
    var sections = [];
    Sections.find({}).exec(function(err,listing)){
        if(err) throw err;
        if(!docs) return res.json({message"No sections retrieved"});
        else if (docs) {
              for(var x=0;x<docs.length;x++){
                sections.push(docs[x].name);
              }
        } 
    
    }
     
    
    //Get Listing
    Listing.find({subjects:{$ne:[]}}).exec(function(err,listing){
        if(err) throw err;
        if(!listing) res.json({message"No listing retrieved"});;
        else if(listing) {
            
            var classes = [];
            //for each listing
            for(var y=0;y<listing.length;y++){
                //create class
                var one_class = {
                    subject_code: listing[y].subject_code,
                    section: sections[counter],
                    major_degree: listing[y].major_degree,
                    degree: listing[y].degree,
                    prof_id: "",
                    units: listing[y].units,
                    term: listing[y].term,
                    student_ids:[]
                }
                
                //get students
                var z = 0;
                var limit = 5;
                var limit_count = 0;
                for(z = limit_count;z<listing[y].students.length;z++){
                    if(limit_count > limit) {
                        limit_count = 0;
                        counter++;
                        var new_class = new Classes(one_class);
                        
                        new_class.save(function(err){
				            if(err) return res.json({message:"Class not saved."});
			                
			            });
			            
			            one_class.section = sections[counter];
                        one_class.student_ids = [];
                        //change section
                        
                    }                    
                    one_class.student_ids.push(listing[y].students[z]);
                    limit_count++;
                }
            
            }
        
        }
    });
        

}


exports.admin_term_end = (req,res) => {
    
    //get grade
    //mark to students
    //archive
    
}

