const express=require("express")
const router=express.Router()
const authController=require("../controller/auth.js")

router.post("/register",authController.registerUser).post("/login",authController.loginUser).post("/logout",authController.logoutUser)

exports.router=router