'use strict'
var faculty = require(__dirname+ '/faculty.js');
var jwt = require('jsonwebtoken');
var cookieExtractor = require(__dirname+'/../../config/cookieExtractor');
module.exports = (router)=>{	
	router.use('/faculty',function(req,res,next){
		
		//check header or url parameters or post parameters for tokens
		var token = cookieExtractor(req);
		//decode token
		if(token){
			
			//verifies ticket and checks expiration
			jwt.verify(token,req.app.get('terces'),function(err,decoded){
				if(err){
						
					return res.redirect('/');
				
				}else{
					console.log(decoded.type);
					if(decoded.type=='f'){
						req.decoded = decoded
						console.log(req.decoded);
						next();
						
					}else{
						return res.status(403).json({success:false,message:'Unauthorized access.'});
					}
				}
				
				
			});
			
		}else{
			//if there is no token
			//return error
	
			return res.status(200).redirect('/');
		}
		
		
	});
	router.get('/faculty/',faculty.faculty_home);
	router.get('/faculty/home',faculty.faculty_home2);
	router.get('/faculty/classes',faculty.faculty_classes);
	router.get('/faculty/classes/get/:prof_id',faculty.faculty_get_classes);
	router.get('/faculty/settings',faculty.faculty_settings);
	router.get('/faculty/reminders',faculty.faculty_reminders);
	
	router.post('/faculty/sections/assign',faculty.faculty_sections_assign);
	router.post('/faculty/reminders',faculty.faculty_send_reminders);
	router.post('/faculty/home',faculty.faculty_getData);
	router.post('/faculty/settings',faculty.faculty_changePassword);
	router.post('/faculty/classes/grade',faculty.faculty_grades);
	return router;
}
