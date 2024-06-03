const User=require("../model/User.js")["User"]

exports.updateUser=async function(req,res){
    try{
    if(req.params.id!==req.userId){
        return res.status(401).json({message:"Unauthorize user"})
    }
    const {password,...updatedUser}=await User.findOneAndUpdate({_id:req.params.id},req.body,{runValidators:true,new:true})
    res.status(202).json(updatedUser)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.getCreatedPost=async function(req,res){
    try{
        const data=await User.findById(req.userId).populate("Posts")
        if(!data)return res.status(404).json({message:"User not found"})
        res.status(200).json(data?.Posts)
    }
    catch(err){
        res.status(500).json({message:"Server error"})
    }
}

exports.savePost=async function(req,res){
    const userId=req.userId
    const postId=req.body.postId
    try{
        const isSave=await User.find({_id:userId,savedPost:{$in:postId}})
        if(isSave[0]){
            await User.findOneAndUpdate({_id:userId},{$pull:{savedPost:postId}})
            return res.status(200).json({message:"Post is removed from saved post"})
        }
        await User.findOneAndUpdate({_id:userId},{$push:{savedPost:postId}})
        return res.status(200).json({message:"Post is added to saved post"})
    }
    catch(err){
        res.status(500).json({message:"Failed to save post"})
    }
}

exports.getSavedPost=async function(req,res){
    const userId=req.userId
    try{
        const user=await User.findById(userId).populate("savedPost")
        res.status(200).json(user?.savedPost)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}