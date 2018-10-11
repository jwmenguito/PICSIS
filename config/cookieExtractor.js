module.exports = (req)=> {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['token'];
		//console.log(token);
		console.log('CookieExtractor: Token Found!');
    }else{
		console.log('no token');
	}
    return token;
};