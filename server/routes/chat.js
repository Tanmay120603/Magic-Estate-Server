const express=require("express")
const router=express.Router()
const chatController=require("../controller/chat.js")
const { verifyToken } = require("../middleware/verifyToken.js")


router.post("/",verifyToken,chatController.createChat).get("/",verifyToken,chatController.getChats).patch("/:id",verifyToken,chatController.readChat)

exports.router=router