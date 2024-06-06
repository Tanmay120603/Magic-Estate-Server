const cookie=require("cookie")
const jwt=require("jsonwebtoken")

function socketAuth(socket,next){
const jsonCookie=cookie.parse(socket.handshake.headers.cookie)
if(!jsonCookie.token)next(new Error("Token not found please login"))

  jwt.verify(jsonCookie.token,process.env.JWT_SECRET_KEY,(err,payload)=>{
    if(err)next(new Error("Invalid token"))
      next()
  })
}

exports.socketAuth=socketAuth