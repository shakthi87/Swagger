const jwt = require('jsonwebtoken')
const {dataMsg}=require('../dataMsg')

module.exports.JWTValidation=(req,res,next)=>{
    const authHeader = req.headers['authorization']
                  const token = authHeader && authHeader.split(' ')[1];
                  if (!token) {
                        res.json({ status:0,message:dataMsg.required_JWT  })
                  } 
                  const decode = jwt.verify(token, process.env.ACCESS_TOKEN,(error,decode)=>{
                    if (error) {
                        res.json({ status:0,error:dataMsg.required_unauthorized })
                  }
               // res.status(200).json({ message: "Token Access", decode })
                req.id = decode.id
                console.log(req.id)
                next();
               })
            

}