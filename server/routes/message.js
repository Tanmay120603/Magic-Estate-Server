const express=require("express")
const { verifyToken } = require("../middleware/verifyToken")
const  messageController= require("../controller/message")
const router=express.Router()

router.post("/",verifyToken,messageController.sendMessage).get("/unread/count",verifyToken,messageController.getUnreadMessages)
exports.router=router