const { Message } = require("./model/Message.js")

function socketHandler(io){

let onlineUsers=[]

io.on("connection",(socket)=>{

  socket.on("user-connected",(data)=>{
      onlineUsers.push(data)
  })

  socket.on("chat-connected",async (data)=>{
      await Message.updateMany({chatId:data.chatId,seenBy:{$nin:data.userId}},{$push:{seenBy:data.userId}})
      const index=onlineUsers.findIndex(user=>user.userId===data?.userId)
      onlineUsers[index]={...onlineUsers[index],chatId:data.chatId}
  })

  socket.on("close-chat",(data)=>{
    onlineUsers=onlineUsers.map(user=>user.userId===data.userId ? {userId:user?.userId,socketId:user?.socketId} : user)
  })

  socket.on("send-message",async (data)=>{
    const receiver=onlineUsers.find(user=>user.userId===data.receiverId)
    if(!receiver)return
    if(receiver.chatId===data.chatId){
      await Message.findOneAndUpdate({_id:data.messageObj?.messageId},{$push:{seenBy:receiver?.userId}})
      return socket.to(receiver.socketId).emit("receive-message",{message:data.messageObj})
    }
    socket.to(receiver.socketId).emit("receive-notification",{chatId:data.chatId,message:data.messageObj})
  })

  socket.on("user-disconnect",(userId)=>{
    onlineUsers=onlineUsers.filter(user=>user.userId!==userId)
  })

  socket.on("disconnect",()=>{
    console.log("disconnected")
  })

})
}

exports.socketHandler=socketHandler