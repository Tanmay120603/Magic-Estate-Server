const User=require("../model/User.js")["User"]
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
require('dotenv').config()

exports.registerUser=async function(req,res){
    try{
    const user=new User(req.body)
    const hashedPassword=await bcrypt.hash(user.password,10)
    user.password=hashedPassword
    const savedUser=await user.save()
    const {password,...createdUser}=savedUser["_doc"]
    const age=1000*60*60*24*7
    const token=jwt.sign({userId:createdUser["_id"]},process.env.JWT_SECRET_KEY,{expiresIn:age})
    res.status(201).cookie("token",token,{maxAge:age,httpOnly:true,sameSite:false,secure:true}).json(createdUser)    
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.loginUser=async function(req,res){
    try{
        const user=await User.findOne({username:req.body.username})
        if(!user){
            return res.status(401).json({message:"Username doesn't exist"})
        }
        const isCorrectPassword=await bcrypt.compare(req.body.password,user.password)
        if(!isCorrectPassword){
           return res.status(401).json({message:"Password is not correct"})
        }
        const age=1000*60*60*24*7
        const token=jwt.sign({userId:user["_id"]},process.env.JWT_SECRET_KEY,{expiresIn:age})
        const {password,...restUserDetails}=user
        res.status(200).cookie("token",token,{maxAge:age,sameSite:"none",httpOnly:true,secure:true}).json(restUserDetails)   
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Internal Server Error"})
    }
}

exports.logoutUser=function (req,res){
    res.clearCookie("token").json({message:"Logout Complete"})
}