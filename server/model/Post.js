const {Schema,model}=require("mongoose")

const PostDetailSchema=Schema({
    desc:{type:String,required:true},
    utilities:{type:String,default:"N/A"},
    petAllowance:{type:String,default:"N/A"},
    deposit:{type:String,default:"N/A"},
    size:{type:Number,required:true,min:1,max:1000000},
    school:{type:Number,min:1},
    bus:{type:Number,min:1},
    restraunt:{type:Number,min:1}
})

const PostSchema=Schema({
    title:{type:String,minlength:4,maxlength:72,required:true},
    images:{type:[String],default:[]},
    address:{type:String,required:true},
    city:{type:String,required:true},
    price:{type:Number,min:1,required:true},
    bedroom:{type:Number,required:true},
    bathroom:{type:Number,required:true},
    longitude:{type:Number,required:true},
    latitude:{type:Number,required:true},
    type:{type:String,enum:["buy","rent"],required:true},
    property:{type:String,enum:["Apartment","House","Condo","Land"],required:true},
    createdAt:{type:Date,default:Date.now()},
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    postDetail:{type:PostDetailSchema,default:{}}
})

exports.Post=model("Post",PostSchema)