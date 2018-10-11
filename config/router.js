'use strict';
//import the controller
var controller = require(__dirname+ '/controller');
var student = require(__dirname+ '/../components/student/student.js');
var faculty = require(__dirname+ '/../components/faculty/faculty');
var admin = require(__dirname+ '/../components/admin/admin');
var User1 = require(__dirname+'/../components/user_student');	//mongoose user schema

var passport = require('passport');
var passportJWT = require("passport-jwt");
var JWTStrategy   = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;


module.exports = (router) =>{
	router.get('/',controller.checkCookie);
	router.get('/announcements',controller.announcements);
	router.get('/password',controller.setPassword);
	router.get('/bayad',controller.bigyanNgBayarin);
	router.get('/user',controller.userDB);
	return router;
	
}