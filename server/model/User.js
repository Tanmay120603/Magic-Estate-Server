const {Schema,model}=require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema=Schema({
    username:{type:String,required:true,unique:true,minlength:3,maxlength:32},
    email:{type:String,unique:true,required:true,validate:{
        validator:function(value){
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)
        },
        message:"Email is not valid"
    }},
    password:{type:String,required:true,minlength:6},
    avatar:{type:String,default:"https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png"},
    Posts:{type:[Schema.Types.ObjectId],ref:"Post"},
    savedPost:{type:[Schema.Types.ObjectId],ref:"Post"},
    createdAt:{type:Number,default:Date.now()}
})

UserSchema.plugin(uniqueValidator,{ message: '{PATH} is already taken.' })

const User=model("User",UserSchema)

exports.User=User