		//check header or url parameters or post parameters for tokens
		var token = req.body.token || req.query.token || req.headers['x-acess-token'];
		//decode token
		if(token){
			
			//verifies ticket and checks expiration
			jwt.verify(token,req.app.get('superSecret'),function(err,decoded){
				if(err){
						
					return res.json({
					success:false,
					message:'Failed to authenticate token.'
					});
				
				}else{
					req.decoded = decoded;
					next();
				}
				
				
			});
			
		}else{
			//if there is no token
			//return error
	
			return res.status(403).send({
				success:false,
				message:'No token provided'
			});
		}
		
		
		if(me.stressed()){
			
			me.notStressed();
		}