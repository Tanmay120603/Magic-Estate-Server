const jwt=require("jsonwebtoken")
require("dotenv").config()

exports.verifyToken=function(req,res,next){
    const token=req.cookies.token
    if(!token) return res.status(401).json({message:"Token not found Please login or register"})
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,payload)=>{
        if(err){
            return res.status(403).json({message:"Invalid Token Please logout and do the login again"})
        }
        else{
            req.userId=payload.userId
            next()
        }
    })
}