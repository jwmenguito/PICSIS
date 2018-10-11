'use strict'
var passportJWT = require("passport-jwt");
var JWTStrategy   = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
var User1 = require(__dirname+'/../components/user_student');

var config = require(__dirname+'/config');	
module.exports = (passport,req)=>{

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['token'];
		console.log('token found!');
		console.log(token);
    }else{
		console.log('no token');
	}
    return token;
};

return passport.use(new JWTStrategy({
        jwtFromRequest: cookieExtractor(req),
        secretOrKey   : config.secret
		},function (jwt_payload, cb) {
			console.log('payload received', jwt_payload);
			User1.findOne({email:jwt_payload.email},function(err,userFound){
				if(userFound) {cb(null,userFound);}
				else {console.log(jwt_payload.email);
					cb(null,false);}
			});
        }
));

}