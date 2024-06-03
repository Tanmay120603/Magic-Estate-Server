const mongoose=require("mongoose")
const cors=require("cors")
const express=require("express")
const http=require("http")
const {Server}=require("socket.io")
const Message=require("./model/Message.js")["Message"]
const cookieParser=require("cookie-parser")
const AuthRouter=require("./routes/auth.js")["router"]
const UserRouter=require("./routes/user.js")["router"]
const PostRouter=require("./routes/post.js")["router"]
const ChatRouter=require("./routes/chat.js")["router"]
const MessageRouter=require("./routes/message.js")["router"]
require("dotenv").config()

const server=express()
const httpServer=http.createServer(server)
const io=new Server(httpServer,{cors:{
  origin:process.env.CLIENT_URL,
  credentials:true
}})

server.use(cors({origin:process.env.CLIENT_URL,credentials:true}))
server.use(express.json())
server.use(cookieParser())
server.use("/api/auth",AuthRouter)
server.use("/api/users",UserRouter)
server.use("/api/posts",PostRouter)
server.use("/api/chats",ChatRouter)
server.use("/api/messages",MessageRouter)

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rt3uxtg.mongodb.net/Real-Estate-db?retryWrites=true&w=majority&appName=Cluster0`,{ignoreUndefined:true});
}

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

httpServer.listen(process.env.PORT)

