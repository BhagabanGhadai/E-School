const jwt = require("jsonwebtoken");

const authToken = (token)=>{
    let tokenValidate = jwt.verify(token,"mankantlaweducation",(err,data)=>{
        if(err) 
        return null
        else{
            return data
        }    
    })
    return tokenValidate
}


const validateToken = async function (req, res, next) {
    try {
        let token = req.headers.authorization || req.headers.authorization
        if (!token) {
           return res.status(401).send({ status: false, message: "Token is Required" });
        }
       let decodedToken = authToken(token)
       if(!decodedToken){
           return res.status(401).send({status:false,message:"invalid Token"})
       }
        console.log(decodedToken)
        
            req["userId"]= decodedToken.userId
             
            next()
          
    } 
    catch (err) {
        return res.status(500).send({  status:"Error", error:err.message })

    }
}
module.exports.validateToken = validateToken