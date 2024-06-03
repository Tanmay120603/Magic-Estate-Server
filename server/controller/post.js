const Post=require("../model/Post.js")["Post"]
const User=require("../model/User.js")["User"]
const jwt=require("jsonwebtoken")
require("dotenv").config()

exports.createPost=async function(req,res){
    const userId=req.userId
    try{
    const {desc,utilities,petAllowance,deposit,size,school,bus,restraunt,...postOverView}=req.body
    const postDetail={desc,utilities,petAllowance,size,school,bus,restraunt,deposit}    
    const post=new Post({...postOverView,postDetail,user:userId})
    const createdPost=await post.save()
    const user=await User.findOneAndUpdate({_id:userId},{$push:{Posts:createdPost["_id"]}},{new:true,runValidators:true})
    res.status(201).json({message:"Post created successfully",userDetails:user["_doc"],postID:createdPost["_id"]})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.getPosts=async function (req,res){
    const maxPrice=+req.query.maxPrice || Number.MAX_SAFE_INTEGER 
    const minPrice=+req.query.minPrice || 1
    const bedroom=+req.query.bedroom || undefined
    const addressRegex=req.query.address ? "(?i)"+req.query.address+"(?-i)" : /[\s\S]+/g
    const type=req.query.type || undefined
    const property=req.query.property || undefined
    try{
    const posts=await Post.find({address:{$regex:addressRegex},bedroom,type,property,$and:[{price:{$gte:minPrice}},{price:{$lte:maxPrice}}]}).select({postDetail:0})
    res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.getPost=async function(req,res){
    const token=req.cookies.token
    try{
        const post=await Post.findById(req.params.id).populate("user")
        if(token){
            jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,payload)=>{
                if(!err){
                   const isSave=await User.findOne({_id:payload.userId,savedPost:{$in:post["_id"]}})
                   return res.status(200).json({...post["_doc"],saved:isSave ? true : false})
                }
                res.status(200).json({...post["_doc"],saved:false})
            })
        }
        else{
            res.status(200).json({...post["_doc"],saved:false})
        }
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.autocompleteSearch=async function (req,res){
   const address=req.query.address || "a"
   const typeRegex=req.query.type ? `${req.query.type}` : /[\s\S]+/g
   const propertyRegex=req.query.property ? `${req.query.property}` : /[\s\S]+/g
   
   try{
        const autoCompletePost=await Post.aggregate([
            {$search:{index:"autoComplete",autocomplete:{query:address,path:"address"}}},
            {$match:{type:{$regex:typeRegex},property:{$regex:propertyRegex}}},
            {$limit:10},
            {$project:{address:1,city:1,score:{$meta:"searchScore"}}}
        ])
        res.status(200).json(autoCompletePost)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}