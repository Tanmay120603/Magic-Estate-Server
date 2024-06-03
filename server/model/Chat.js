const {Schema, model}=require("mongoose")

const ChatSchema=new Schema({
    users:[{type:Schema.Types.ObjectId,ref:"User"}],
    messages:[{type:Schema.Types.ObjectId,ref:"Message"}],
    lastMessage:{type:String},
    createdAt:{type:Number,default:Date.now()}
})

exports.Chat=model("Chat",ChatSchema)
