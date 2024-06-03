const mongoose=require("mongoose")
const cors=require("cors")
const express=require("express")
const http=require("http")
const {Server}=require("socket.io")
const cookieParser=require("cookie-parser")
const {socketHandler}=require("./socketHandler.js")
const AuthRouter=require("./routes/auth.js")["router"]
const UserRouter=require("./routes/user.js")["router"]
const PostRouter=require("./routes/post.js")["router"]
const ChatRouter=require("./routes/chat.js")["router"]
const MessageRouter=require("./routes/message.js")["router"]
require("dotenv").config()

const server=express()
const httpServer=http.createServer(server)
const io=new Server(httpServer,{cors:{
  origin:process.env.CLIENT_URL
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

httpServer.listen(8080,()=>{
  socketHandler(io)
})

