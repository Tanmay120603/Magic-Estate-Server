const {Schema,model}=require("mongoose")

const MessageSchema=new Schema({
    content:{type:String,required:true},
    createdAt:{type:Number,default:Date.now()},
    seenBy:[{type:Schema.Types.ObjectId}],
    chatId:{type:Schema.Types.ObjectId},
    senderId:{type:Schema.Types.ObjectId},
    receiverId:{type:Schema.Types.ObjectId}
})

exports.Message=model("Message",MessageSchema)
