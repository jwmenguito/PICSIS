'use strict'
var admin = require(__dirname+ '/admin.js');
var jwt = require('jsonwebtoken');
var cookieExtractor = require(__dirname+'/../../config/cookieExtractor');	
module.exports = (router) =>{
	router.use('/admin',function(req,res,next){
		
		//check header or url parameters or post parameters for tokens
		var token = cookieExtractor(req);
		//decode token
		if(token){
			
			//verifies ticket and checks expiration
			jwt.verify(token,req.app.get('terces'),function(err,decoded){
				if(err){
						
					return res.status(200).redirect('/');
				
				
				}else{
					if(decoded.type=='a'){
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
	
			return res.redirect('/');
		}
		
		
	});
	
	router.get('/admin/',admin.admin_home);
	router.get('/admin/home',admin.admin_home);
	router.get('/admin/records',admin.admin_records);
    router.get('/admin/listing',admin.admin_records);
    router.get('/admin/term',admin.admin_records);
    router.get('/admin/section/create',admin.admin_section_create);
    //For Adding
    
    router.post('/admin/listing/add',admin.admin_listing_add);
    router.post('/admin/listing/add/all',admin.admin_listing_add_all);
    router.post('/admin/listing/enroll',admin.admin_listing_enroll);
    
    //For Clearing
    router.post('/admin/listing/remove',admin.admin_listing_remove);
    router.post('/admin/listing/remove/all',admin.admin_listing_remove_all);
    router.post('/admin/listing/clear',admin.admin_listing_clear);
    router.post('/admin/term/sections',admin.admin_term_sections);
	router.post('/admin/records',admin.admin_get_records);
	router.post('/admin/records/add/student',admin.admin_add_student);
	router.post('/admin/records/add/subject',admin.admin_add_subject);
	router.post('/admin/records/add/faculty',admin.admin_add_faculty);
	router.post('/admin/records/edit/faculty',admin.admin_edit_faculty);
	router.post('/admin/records/edit/student',admin.admin_edit_student);
	router.post('/admin/records/edit/subject',admin.admin_edit_subject);
	router.post('/admin/records/archive',admin.admin_archive);
    	
	return router;
}
