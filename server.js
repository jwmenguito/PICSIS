//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens reference 
'use strict'
var express = require ('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var helmet = require('helmet');
var session = require('express-session');
var appRouter = express.Router();

var router = require(__dirname +'/config/router');
var api = require(__dirname +'/config/api');
var config = require(__dirname+'/config/config');	
var passport_conf = require(__dirname + '/config/passport');

var student = require(__dirname+ '/components/student/student_routes');
var faculty = require(__dirname+ '/components/faculty/faculty_routes');
var admin = require(__dirname+ '/components/admin/admin_routes');
var redirection = require(__dirname+ '/components/redirection_routes');

//token handler
var port = process.env.PORT || 3000;
mongoose.connect(config.database);	//access the database


app.use(helmet());
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/res'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'terces',
  name: 'sessionId',
  saveUninitialized: false,
  resave: true
}))


app.set('terces',config.secret);//secret variable
app.use(morgan('dev'));
app.set('Authorization','');
//routing

app.use(router(appRouter));
app.use('/api',api(appRouter));
app.use(student(appRouter));
app.use(faculty(appRouter));
app.use(admin(appRouter));
app.use(redirection(appRouter));


app.listen(port)
console.log('Running on port '+port)