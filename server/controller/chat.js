const Chat=require("../model/Chat.js")['Chat']
const Message=require("../model/Message.js")['Message']

exports.createChat=async function(req,res){
    const userId=req.userId
    if(userId===req.body.receiverId)return res.status(400).json({message:"Same user can't have chat"})
    try{
    const existedChat=await Chat.find({users:{$all:[userId,req.body.receiverId]}})
    if(!existedChat[0]){
        const chat=new Chat({users:[userId,req.body.receiverId]})
        const createdChat=await chat.save()
        return res.status(201).json({chatId:createdChat["_id"]})
    }
    res.status(200).json({chatId:existedChat[0]["_id"]})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.getChats=async function(req,res){
    const userId=req.userId
    try{
    const chats=await Chat.find({users:{$in:userId}}).populate({path:"users",match:{_id:{$ne:userId}}}).populate({path:"messages",match:{seenBy:{$nin:userId}}})
    console.log(chats[1],userId)
    res.status(200).json(chats)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.readChat=async function (req,res){
    const userId=req.userId
    try{
    await Message.updateMany({chatId:req.params.id,seenBy:{$nin:userId}},{$push:{seenBy:userId}})
    const chat=await Chat.findById(req.params.id).populate("messages").populate({path:"users",match:{_id:{$ne:userId}}})
    res.status(200).json(chat)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}