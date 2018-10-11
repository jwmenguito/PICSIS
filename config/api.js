'use strict'
var express = require ('express');
var apiRouter = express.Router();
var controller = require(__dirname+ '/controller');
var jwt = require('jsonwebtoken');					//session handler
module.exports = (apiRouter) =>{

	apiRouter.post('/authenticate',controller.authenticate);
	return apiRouter;
}