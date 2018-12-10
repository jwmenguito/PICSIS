'use strict'
var Faculty = require(__dirname+'/../user_faculty');	//mongoose user
var Subjects = require(__dirname+'/../subjects');
var Student = require(__dirname+'/../user_student');
var Classes = require(__dirname+'/../classes');

var path = require('path');
var jwt = require('jsonwebtoken');
var cookieExtractor = require(__dirname+'/../../config/cookieExtractor');

exports.faculty_home = (req,res) =>{
	console.log("Faculty Log In");
	
	var token = cookieExtractor(req);
		//decode token
		if(token){
			
			//verifies ticket and checks expiration
			jwt.verify(token,req.app.get('terces'),function(err,decoded){
				if(err){
						
					console.log("Error");
				
				}else{
						req.decoded = decoded
						console.log(req.decoded);
						console.log("TOKEN DECODED");
				}
			});
			
		}else{
			//if there is no token
			//return error
			console.log("Token not found");
			return res.status(401).sendFile(path.join(__dirname + '/../../login.html'));
		}
	
		console.log("Finding faculty in database");	
		Faculty.findOne({email:req.decoded.email},
		function(err,userFound){
			if(err) throw err;
			
			if(!userFound){
				console.log("User not found");
				return res.status(403).sendFile(path.join(__dirname + '/../../login.html'));
				
				
			}else if(userFound){
				//return res.send(userFound);
				console.log(userFound);
				//res.json(userFound);
				res.cookie('user',userFound.prof_id);
				return res.status(200).sendFile(path.join(__dirname + '/../../home.html'));  
			}
			
		});
	
}
exports.faculty_home2 = (req,res) =>{
		return res.status(200).sendFile(path.join(__dirname + '/../../home.html'));
}
exports.faculty_classes = (req,res) =>{
	
	return res.status(200).sendFile(path.join(__dirname + '/../../home.html')); 
}
exports.faculty_get_classes = (req,res) =>{
	//req.params.prof_id;
	/*
	Subjects.find({prof_id:req.params.prof_id})
	.populate({
		path:'students',
		//match:{checklist:{$elemMatch:{subject_code:'SC101'}}},
		//select:['lname','fname','student_no'],
		options:{sort:{'lname':1}}	//sort by last name
	})
	.exec(
		function(err,docs){
			if(err) throw err;
			if(docs){
				console.log(JSON.stringify(docs));
				res.json(docs);
			 }
			else console.log("Something is wrong");

	});
	
	*/
	
	    Classes.find({prof_id:req.params.prof_id}).populate({path:'students',options:{sort:{'lname':1}}}).exec(function(err,docs){

            if(err) throw err;
            if(!docs) return res.json({message:"No sections."});
            else if(docs) {
                var obj = {
                    classes: docs,
                    message: "Found "+docs.length+" sections!"
                }
                return res.json(docs)
                
            };    

	    });

}

exports.faculty_reminders = (req,res) =>{
	res.status(200).sendFile(path.join(__dirname + '/../../home.html')); 
}

exports.faculty_settings = (req,res) =>{
	res.status(200).sendFile(path.join(__dirname + '/../../home.html'));
}

exports.faculty_send_reminders = (req,res) =>{
	var month = new Date().getMonth();
	var day = new Date().getDay();
	var year = new Date.getFullYear();
	var reminder = {
		
		title:req.body.title,
		message:req.body.msg,
		date:month+" "+day+", "+year
	}

	Student.update({'checklist.subject_code':req.body.subject_code},{$push:{reminders:reminder}},function(err,doc){
		if(err) throw err;
		if(doc) res.json({message:"Success!"});
		else res.json({message:'Failed!'});
	});
}
exports.faculty_changePassword = (req,res) => {
		
		Faculty.findOne({prof_id:req.body.prof_id},
			function(err,user){
				if(err) throw err;
				if(!user) console.log("User not found");
				if(user){
					if(user.validatePassword(req.body.oldPassword)){
						user.setPassword(req.body.newPassword);
						user.save();
						res.json({message:"New password successfully set!"});
					}else{
						console.log("Wrong password!");
						res.json({message:"Password entered is wrong!"});
					}
				}
			}
		)
	
}

exports.faculty_getData = (req,res) =>{
	
		console.log(req.body.student_no);
		Faculty.findOne({prof_id:req.body.prof_id}).exec(
		function(err,userFound){
			if(err) throw err;
			
			if(!userFound){
				console.log("Professor not found");
			return res.json({message:"Error occurred"});
				
				
			}else if(userFound){
				//return res.send(userFound);
				console.log(userFound);	
				return res.json(userFound);	  
			}
			
		});
}



exports.faculty_grades = (req,res) => {
        console.log("\n\n\n");
        console.log("GRADE: "+req.body.grade);
        console.log("Subject_code: "+req.body.subject_code);
        console.log("student_no: "+req.body.student_no);
        
        console.log("\n\n\n");
        Student.findOne({student_no:req.body.student_no,"checklist.subjects.subject_code":req.body.subject_code}).exec(function(err,docs){
            
            if(err) throw err;
            if(docs) { 
            
                console.log(docs);
                return res.json({message:docs});
            
            }
        
        });
        
        
        /**
		Student.findOne({student_no:req.body.student_no}).exec(function(err,doc){
			if(err) throw err;
			if(!doc) res.json({message:"Failed to update grade"});
			if(doc) {
			    console.log("FOUND: "+doc);
			    for(var x=0;x<doc.checklist.length;x++){
			        
			        for(var y=0;y<doc.checklist[x].subjects.length;y++){
			            
			            if(doc.checklist[x].subjects[y].subject_code == req.body.subject_code){
			                
			                console.log("\n\nBEFORE GRADED: "+doc.checklist[x].subjects[y].grade);
			                doc.checklist[x].subjects[y].grade = req.body.grade;
			                doc.save(function(err){
			                    if (err) throw err;
			                    
			                });
			                    
			                console.log("GRADED: "+doc.checklist[x].subjects[y].grade);
			                console.log("\n\n");
			            }
			        }
			    
			    }
				console.log(doc);
				res.json({message:"Success! Refresh the page to see updates.", grade: req.body.grade});
			}
});
	**/
	
}

exports.faculty_sections_assign = (req,res) => {
    //First, find self
    console.log(req.body.prof_id);
    
    Faculty.findOne({prof_id:req.body.prof_id}).exec(function(err,doc){
        if(err) throw err;
        if(!doc) return res.json({message:"Unable to retrieve professor data."});
        else if (doc){
            console.log("\n\n\n\nDOCUMENT FOUND: "+doc);
            //if data is found, find sections based on degree and major
            
            Classes.find({major_degree:doc.major}).sort({subject_code:1}).exec(function(err2,doc2){
                if(err2) throw err2;
               
                //return doc2
                var data = {
                    classes:doc2
                }
                return res.json(data);
                
            });
                
        }    
    
    });
    
    

}


exports.faculty_sections_assign_class = (req,res) => {
    //First, find self
    console.log("Incoming data: ");
    
    console.log(req.body.subject_code);
    console.log(req.body.section);
    console.log(req.body.prof_id);
    
    Classes.updateOne({subject_code:req.body.subject_code,section:req.body.section},{$set:{prof_id:req.body.prof_id}}).exec(function(err,doc){
        if(err) throw err;
        if(!doc) return res.json({message:"Was unable to update section."});
        else if (doc){
            return res.json({message:"Successfully assigned to" + doc.nModified +" section."});
        }    
    
    });
    
    

}
