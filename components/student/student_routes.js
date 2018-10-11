'use strict'
var student = require(__dirname+ '/student.js');
var jwt = require('jsonwebtoken');
var cookieExtractor = require(__dirname+'/../../config/cookieExtractor');
var path = require('path');

module.exports = (router) =>{
	
	router.use('/student',function(req,res,next){
		
		//check header or url parameters or post parameters for tokens
		var token = cookieExtractor(req);
		//decode token
		if(token){
			
			//verifies ticket and checks expiration
			jwt.verify(token,req.app.get('terces'),function(err,decoded){
				if(err){
						
					return res.status(200).redirect('/');
				
				}else{
					if(decoded.type=='s'){
						console.log('student_routes > token accepted\n\n');
						next();
					}else{
						return res.status(403).json({success:false,message:'Unauthorized access.'});
					}
				}	
				
				
			});
			
		}else{
			//if there is no token
			//return error
	
			return res.redirect('/');
		}
		
		
	});
	
	//router.use('/student',express.static(path.join(__dirname + '/../../home.html')));			
	router.get('/student',student.student_home);
	router.get('/student/home/*',student.student_home2);
	router.get('/student/fees/*',student.student_fees);
	router.get('/student/grades*/',student.student_grades);
	router.get('/student/requests*/',student.student_requests);
	router.get('/student/settings',student.student_settings);
	
	router.post('/student/settings',student.student_changePassword);
	router.post('/student/home',student.student_getData);
	router.post('/student/requests/send',student.student_send_request);
	
	router.get('/student*',function(req,res){
		res.status(200).redirect('/student');
	});
	return router;
}