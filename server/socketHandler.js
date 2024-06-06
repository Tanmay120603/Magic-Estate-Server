const {socketAuth} = require("./middleware/socketAuth.js")

const Message=require("./model/Message.js")["Message"]
require("dotenv").config()

let onlineUsers=new Map()

function socketHandler(io){

io.use((socket,next)=>{
  socketAuth(socket,next)
})

io.on("connection",(socket)=>{

  socket.on("user-connected",({userId,socketId})=>{
      onlineUsers.set(userId,{socketId})
  })

  socket.on("typing",({chatId,receiverId})=>{
    const receiver=onlineUsers.get(receiverId)
    if(receiver?.chatId===chatId)socket.to(receiver?.socketId).emit("user-typing")
  })

  socket.on("stop-typing",({chatId,receiverId})=>{
    const receiver=onlineUsers.get(receiverId)
    if(receiver?.chatId===chatId)socket.to(receiver?.socketId).emit("user-typing-stop")
  })

  socket.on("chat-connected",async({userId,chatId})=>{
      await Message.updateMany({chatId,seenBy:{$nin:userId}},{$push:{seenBy:userId}})
      onlineUsers.set(userId,{...onlineUsers.get(userId),chatId})
  })

  socket.on("close-chat",({userId})=>{
    delete onlineUsers.get(userId)?.chatId
  })

  socket.on("send-message",async(data)=>{
    const receiver=onlineUsers.get(data?.messageObj?.receiverId)
    if(!receiver)return
    if(receiver.chatId===data.chatId){
      await Message.findByIdAndUpdate(data?.messageObj?.messageId,{$push:{seenBy:data?.messageObj?.receiverId}},{new:true})
      return socket.to(receiver.socketId).emit("receive-message",{senderId:data?.senderId,...data.messageObj}) 
    }

    socket.to(receiver.socketId).emit("receive-notification",{chatId:data.chatId,message:data.messageObj})
  })

  socket.on("user-disconnect",(userId)=>{
    onlineUsers.delete(userId)
  })

})
}

exports.socketHandler=socketHandler