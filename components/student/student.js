'use strict'
var student = require(__dirname+'/../user_student');	//mongoose user
var jwt = require('jsonwebtoken');
var cookieExtractor = require(__dirname+'/../../config/cookieExtractor');
var path = require('path');
var nodemailer = require('nodemailer');
exports.student_home = (req,res) =>{
	console.log("student.js > student_home");
	
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
	
		
		console.log("Finding student in database");	
		student.findOne({email:req.decoded.email},
		function(err,userFound){
			if(err) throw err;
			
			if(!userFound){
				console.log("Student number not found");
				return res.redirect('/');
				
				
			}else if(userFound){
				//return res.send(userFound);
				console.log(userFound);
				
				res.cookie('user',userFound.student_no);
				return res.status(200).sendFile(path.join(__dirname + '/../../home.html'));  
			}
			
		});
	
}
exports.student_home2 = (req,res) =>{
		return res.status(200).sendFile(path.join(__dirname + '/../../home.html'));
}
exports.student_getData = (req,res) =>{
	
		console.log(req.body.student_no);
		student.findOne({student_no:req.body.student_no}).populate('fees').exec(
		function(err,userFound){
			if(err) throw err;
			
			if(!userFound){
				console.log("Student number not found");
			return res.json({message:"Error occurred"});
				
				
			}else if(userFound){
				//return res.send(userFound);
				console.log(userFound);	
				return res.json(userFound);	  
			}
			
		});
}
exports.student_grades  = (req,res) =>{

	res.status(200).sendFile(path.join(__dirname + '/../../home.html'));  
}
exports.student_fees  = (req,res) =>{

	res.status(200).sendFile(path.join(__dirname + '/../../home.html'));  
}
exports.student_requests  = (req,res) =>{
	

	res.status(200).sendFile(path.join(__dirname + '/../../home.html'));  
}
exports.student_send_request = (req,res) => { 
	student.findOne({student_no:req.body.student_no},
		function(err,userFound){
			if(err) throw err;
			
			if(!userFound){
				console.log("Student number not found");
				res.json({message:"Something went wrong. Request was not sent."});
				
			}else if(userFound){
				
				var transporter = nodemailer.createTransport({
					service: "gmail",
					host:"smtp.gmail.com",
					port:587,
					secure:false,
					auth:{ 
						user:"jwmenguito@up.edu.ph",
						pass:"youngblood14"
					}
			
			
		});
		
		const mailOptions = {
			to: "jamespaolo.menguito@gmail.com",
			from:"jwmenguito@up.edu.ph",
			subject:"TOR_REQUEST "+userFound.student_no,
			html:
			"<ul><li>Student Number: "+ userFound.student_no + "</li>"+ 
			"<li> Last Name: " + userFound.lname + "</li>"+
			"<li> First Name: " + userFound.fname + "</li>"+
			"<li> Course: " + userFound.course + "</li>"+
			"<li> Major/Degree: " + userFound.major_degree + "</li></ul>"
		};
		
		transporter.sendMail(mailOptions,function(err,info){
			if(err){
				console.log(err);
				res.json({message:"Something went wrong. Request was not sent."});
			}
			else {
				console.log(info);
				res.json({message:"Request successfully sent!"});
			}
		});
			}
			
	});

	
	
	
}
exports.student_settings = (req,res) =>{
	res.status(200).sendFile(path.join(__dirname + '/../../home.html'));
}
exports.student_changePassword = (req,res) => {
		console.log(req.body.student_no);
		console.log(req.body.newPassword);
		
		student.findOne({student_no:req.body.student_no},
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

exports.student_clear_reminders = (req,res) => {
    
    student.update({student_no:req.body.students.student_no},{$set:{reminders:[]}},{multi:false}).exec(function(err,doc){
        if(err) throw err;
        if(!doc) return res.json({message:"An error occurred while clearing reminders!"});
        else if(doc) return res.json({message:"Successfully cleared reminders!"});
    });   

}
