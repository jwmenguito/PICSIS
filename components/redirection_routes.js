'use strict'
var path = require('path');
module.exports = (router) => {
	router.get('*',function(req,res){
		res.status(300).redirect('/');  
	});
	
	return router;
}