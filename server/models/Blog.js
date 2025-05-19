const mongoose=require('mongoose');

const BlogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    content:{
        type:String,
        required:true,
        trim:true,
    },
    tags:[
        {
        type:String,
        }
    ],
    status:{
        type:String,
        enum:["draft","published"],
        default:"draft",
        required:true,
    },
    
},
{
  timestamps: true // 👈 This auto-adds createdAt and updatedAt
})

module.exports=mongoose.model("Blog",BlogSchema);