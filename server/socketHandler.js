const Message=require("./model/Message.js")["Message"]

let onlineUsers=[]

function socketHandler(io){

io.on("connection",(socket)=>{

  socket.on("user-connected",(data)=>{
      onlineUsers.push(data)
      console.log("User Connected--->",onlineUsers)
  })

  socket.on("chat-connected",(data)=>{
      const index=onlineUsers.findIndex(user=>user.userId===data?.userId)
      onlineUsers[index]={...onlineUsers[index],chatId:data.chatId}   
      console.log("Chat opened--->",onlineUsers)
  })

  socket.on("close-chat",(data)=>{
    onlineUsers=onlineUsers.map(user=>user.userId===data.userId ? {userId:user?.userId,socketId:user?.socketId} : user)
    console.log("Chat Closed--->",onlineUsers)
  })

  socket.on("send-message",(data)=>{
    const receiver=onlineUsers.find(user=>user.userId===data?.messageObj?.receiverId)
    if(!receiver)return
    if(receiver.chatId===data.chatId){
      return socket.to(receiver.socketId).emit("receive-message",{senderId:data?.senderId,...data.messageObj}) 
    }

    socket.to(receiver.socketId).emit("receive-notification",{chatId:data.chatId,message:data.messageObj})
  })

  socket.on("user-disconnect",(userId)=>{
    onlineUsers=onlineUsers.filter(user=>user.userId!==userId)
    console.log("User Disconnected--->",onlineUsers)
  })

  socket.on("disconnect",()=>{
    console.log("disconnected")
  })

})
}

exports.socketHandler=socketHandler