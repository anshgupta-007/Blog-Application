const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    resetpasswordExpires:{
        type:Date,
    },
    Blogs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Blog"
        }
    ]
})

module.exports=mongoose.model("User",UserSchema);