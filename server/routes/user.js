const express=require("express")
const userController=require("../controller/user.js")
const { verifyToken } = require("../middleware/verifyToken.js")

const router=express.Router()

router.post("/post/save",verifyToken,userController.savePost).get("/post/created",verifyToken,userController.getCreatedPost).get("/post/saved",verifyToken,userController.getSavedPost).patch("/:id",verifyToken,userController.updateUser)

exports.router=router