const jwt = require('jsonwebtoken')


const userAuth = async function (req, res, next) {

    let token = req.header('x-auth-key')
    
    if (!token) {
        return res.status(403).send({ status: false, message: `Missing authentication token in request` })
    }
    //Decode Token to extract Time
    let decode=jwt.decode(token,'assign')

   
    
    //compare expiry time with current time.
    if(Date.now() > (decode.exp)*1000){
        return res.status(403).send({ status: false, message: `Session Expired, please login again`  })
    }
    
  
    let verifyToken=jwt.verify(token,'assign')
    
    if(!verifyToken){
        return res.status(403).send({ status: false, message: `Invalid authentication token in request ` })
    }
    
    req.userId=verifyToken.userId
    next()
} 


module.exports={userAuth}