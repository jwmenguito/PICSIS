'use strict'
var path = require('path');
var Faculty = require(__dirname+'/../user_faculty');	//mongoose user
var Subjects = require(__dirname+'/../subjects');
var Student = require(__dirname+'/../user_student');
var admin = require(__dirname+'/../user_admin');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var cookieExtractor = require(__dirname+'/../../config/cookieExtractor');
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
				
				res.cookie('user',userFound);
				return res.status(200).sendFile(path.join(__dirname + '/../../home.html'));  
			}
			
		});
}

exports.admin_records = (req,res) =>{
	res.status(200).sendFile(path.join(__dirname + '/../../home.html')); 
}
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

exports.admin_add_student = (req,res) => {
	console.log(req.body);
	var student = new Student(req.body);
	Subjects.find({major_degree:req.body.major_degree}).sort({subject_code:1}).exec(function(err,docs){
		if(err) throw err;
		if(!docs) console.log("No subjects");
		if(docs){
			for(var i=0;i<docs.length;i++){
				var subject = {
					subject_code : docs[i].subject_code,
					grade : "N"
				}
				console.log(subject);
				student.checklist.push(subject);
				
				
			}
			student._id = new mongoose.Types.ObjectId();
			var fee = {
				_id:new mongoose.Types.ObjectId(),
				student:student._id,
				term:1,
				amount:12300,
				receipt:""
			}
			student.fees.push(fee);
			console.log(student);
			student.save(function(err){
				if(err) return res.json({message:'Student not saved'});
				else return res.json({message:'Student successfully saved'});
			});	
			
		}
	});
	
	// return res.json({message:'Student successfully saved'});
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
		var archiveDb = mongoose.createConnection('mongodb://localhost/PICSIS_ARCHIVE');
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
		
	}else if(req.body.collection=='subject'){
		var archiveDb = mongoose.createConnection('mongodb://localhost/PICSIS_ARCHIVE');
		archiveDb.createCollection('subjectArchive'+month+year).then(function(err,collection){
			if(err) throw err;
		});
		var subjectArchive = archiveDb.collection('subjectArchive'+month+year);
		Subjects.find({}).sort({lname:1}).exec(function(err,docs){
			if(err) throw err;
			if(!docs) return res.json({message:'Something went wrong...'});
			if(docs){
				subjectArchive.insertMany(docs,function(err,docs){
					if(err) throw err;
				});
			};
		
		})
	}else if(req.body.collection=='faculty'){
		var archiveDb = mongoose.createConnection('mongodb://localhost/PICSIS_ARCHIVE');
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