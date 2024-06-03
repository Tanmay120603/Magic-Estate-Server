const { Chat } = require("../model/Chat")
const Message=require("../model/Message.js")['Message']

exports.createMessage=async function(req,res){
    const senderId=req.userId
    const message=new Message({senderId,...req.body,seenBy:[senderId]})
    const {_id,...rest}=await message.save()
    await Chat.findOneAndUpdate({_id:req.body.chatId},{$push:{messages:_id},lastMessage:rest["_doc"]?.content})
    res.status(201).json(rest["_doc"])
}

exports.getUnreadMessages=async function(req,res){
    const userId=req.userId
    const unreadMessagesCount=await Message.countDocuments({receiverId:userId,seenBy:{$nin:userId}})
    res.status(200).json(unreadMessagesCount)
}