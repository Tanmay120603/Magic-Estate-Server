const { Chat } = require("../model/Chat")
const Message=require("../model/Message.js")['Message']

exports.sendMessage=async function(req,res){
    const senderId=req.userId
    try{
    const message=new Message({senderId,...req.body,seenBy:[senderId]})
    const {_id,...rest}=await message.save()
    await Chat.findOneAndUpdate({_id:req.body.chatId},{$push:{messages:_id},lastMessage:rest["_doc"]?.content})
    res.status(201).json(rest["_doc"])
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.receiveMessage=async function(req,res){
    try{
        const res=await Message.updateMany({chatId:req.body.chatId,seenBy:{$nin:req.body.receiverId}},{$push:{seenBy:req.body.receiverId}})
        res.status(200).json({message:"Received and updated successfully"})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

exports.getUnreadMessages=async function(req,res){
    const userId=req.userId
    try{
    const unreadMessagesCount=await Message.countDocuments({receiverId:userId,seenBy:{$nin:userId}})
    res.status(200).json(unreadMessagesCount)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}