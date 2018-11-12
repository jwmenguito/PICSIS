'use strict'
//establish sql connection
var path = require('path');
var fs = require('fs');
//required for authentication
var passport = require('passport');
var passportJWT = require('passport-jwt');
var jwt = require('jsonwebtoken');					//session handler
var nodemailer = require('nodemailer');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var mongoose = require('mongoose');
var announcements = fs.readFileSync('res/json/announcements.json','utf8');
 
var usr = require(__dirname+'/../components/usr');
var Fee = require(__dirname+'/../components/fee');
var config = require(__dirname+'/config');
var cookieExtractor = require(__dirname+'/cookieExtractor');
exports.checkCookie = (req,res) => {
		var token = cookieExtractor(req);
		//decode token
		if(token){
			
			//verifies ticket and checks expiration
			jwt.verify(token,req.app.get('terces'),function(err,decoded){
				if(err){
					return res.status(401).sendFile(path.join(__dirname + '/../index.html'));
					//throw err;	
					//console.log("Error");
					
				}else{
						req.decoded = decoded
						console.log(req.decoded);
						console.log("controller.js/checkCookie: TOKEN DECODED");
						if(req.decoded.url=="/student"){
							res.status(200).redirect('/student');
						}else if(req.decoded.url=="/faculty"){
							res.status(200).redirect('/faculty');
						}else if(req.decoded.url=="/admin"){
							res.status(200).redirect('/admin');
						}
				}
			});
			
		}else{
			//if there is no token
			//return error
			console.log("Token not found");
			return res.status(401).sendFile(path.join(__dirname + '/../index.html'));
		}
		
		
}
exports.authenticate = (req,res,next)=>{
		
		usr.findOne({email:req.body.email},
		function(err,userFound){
			if(err) throw err;
			
			if(!userFound){
				console.log("Email: "+req.body.email+" not found.");
				alert("Email is not registered!");
				return res.status(200).redirect('/');
				
				
			}else if(userFound){
				
				//check if password matches
				if(!userFound.validatePassword(req.body.password)){
					console.log("Wrong email + password combination");
					alert("Incorrect password")
					return res.status(200).redirect('/');
					
				}else{
					// if user is found and password is right
					// create a token with only our given payload
					// we don't want to pass in the entire user since that has the password
					console.log("User found in userCollection database");
					var user_id = "";
					var url = "";
					console.log("User details: \n");
					console.log(userFound);
					console.log("USER email PUTANGINA = "+userFound.type);
					if(userFound.type=='s'){
						user_id = userFound.student_no;
						url = "/student";
						console.log(userFound.email +" is a student.");
					}
					else if(userFound.type=='f'){
						user_id = userFound.prof_id;
						url = "/faculty";
						console.log(userFound.email +" is a faculty.");
					}
					else if(userFound.type=='a'){
						user_id = userFound.admin_id;
						url = "/admin";
						console.log(userFound.email +" is an admin.");
					}
					else{
						console.log(userFound.email +" is none of the above.");
						return res.sendFile(path.join(__dirname + '/../index.html')); 
					}
					const payload={
						type:userFound.type,
						url:url,
						email:userFound.email
					}
					var token = jwt.sign(payload,req.app.get('terces'),{
						expiresIn:60*60//expires in 24 hrs
					});
					console.log(url+ " is the url.");
					res.cookie('token',token);
					//return res.status(200).redirect(url);
					//return res.sendFile(path.join(__dirname + '/../home.html'));
					return res.json({message:url});
				}
	
			}
			
		});
		
	
}

exports.log_in = (req,res) =>{
		res.sendFile(path.join(__dirname + '/../index.html'));
		
}

exports.announcements = (req,res) =>{		
		res.send(JSON.parse(announcements));
}

exports.setPassword = (req,res) => {
		admin.findOne({},
		function(err,userFound){
			if(err) throw err;
			
			if(!userFound){
				console.log('No user found');
				return res.redirect('/');
			}else if(userFound){
				userFound.setPassword("youngblood14");
				userFound.save();
				console.log('Nice');
				return res.json({message:"Success!"})
			}
			
		});
}

exports.bigyanNgBayarin = (req,res) => {
		/*
		Student.find({}).populate('fees').exec(function(err,docs){
			if(err) throw err
			if(docs){
				for(var i=0;i<docs.length;i++){
					/*var fee = new Fee({
						_id: new mongoose.Types.ObjectId(),
						student:docs[i]._id,
						amount:13525,
						receipt:""
					});
					
					fee.save(function(err){
						if(err) throw err;
					});
					docs[i].fees.push(fee);
					docs[i].save();
					
					console.log(fee);
					console.log(docs[i]._id);
				
					console.log(docs[i].fees);
				}
				
				res.json({message:'Success'});
			}else res.json({message:'Failure'});
		});
		
		Fee.find({}).populate('student').exec(function(err,docs){
			if(err) throw err;
			for(var i=0;i<docs.length;i++){
				console.log(docs[i].student.lname);
				docs[i].term = "Term 1";
				docs[i].save();
			}
		})*/
		Fee.update({},{$set:{Term:1}}).populate('student').exec(function(err,docs){
			if(err) throw err;
			if(docs){
				
				for(var i=0;i<docs.length;i++){
					console.log(docs[i]);
				
				}	
				res.json({message:"success!"});
			}
			
		});
		/*
		Student.update({},{$push:{reminders:reminder}},function(err,doc){
			if(err) throw err;
			if(doc) res.json({message:"Success!"});
			else res.json({message:'Failed!'});
		});
		*/
}

exports.userDB = (req,res) => {
	Student.find({}).exec(function(err,docs){
			
	
	});	
		Student.db.createCollection('userCollection').then(function(err,collection){
			if(err) throw err;
		});
		var users = Student.db.collection('userCollection');
		/*
		faculty.find({}).sort({lname:1}).select('email hash salt').exec(function(err,docs){
			if(err) throw err;
			if(!docs) return res.json({message:'Something went wrong...'});
			if(docs){
				docs.forEach(function(doc){
					doc.type = 'f';
				});
				console.log(docs);
				users.insertMany(docs,function(err,docs){
					if(err) throw err;
				});
			};
		
		})*/
		users.find({},function(err,docs){
			docs.forEach(function(doc){
				console.log(doc);
			});
		})
	res.json({messg:"done"});
}