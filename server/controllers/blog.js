const User = require("../models/User");
const Blog = require("../models/Blog");


exports.createBlog = async (req, res) => {
    const {title, content, tags,status} = req.body;
    const {email} = req.user;
    try{
        const newBlog =await Blog.create({title,content,tags,status});
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }

        user.Blogs.push(newBlog._id);
        await user.save();
        return res.status(200).json(
            {
            message:"Blog Created Successfully",
            id:newBlog._id,});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.updateBlog = async (req, res) => {
    const {title, content, tags,status,id} = req.body;
    const userBlogsId = req.user.Blogs;
    // console.log("User",userBlogsId);
    // console.log("My ID",id);
    try{
        const blog = await Blog.findById(id);

        if(!blog){
            return res.status(404).json({message:"Blog Not Found"});
        }
        if(userBlogsId.find(blog => blog == id) === undefined){
            return res.status(403).json({message:"You are not authorized to update this blog"});
        }
        if(blog.status === "published"){
            return res.status(400).json({message:"Cannot Update Published Blog"});
        }
    
        blog.title = title;
        blog.content = content;
        blog.tags = tags;
        blog.status = status;
        await blog.save();

        return res.status(200).json({message:"Blog Updated Successfully",blog});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.deleteBlog = async (req, res) => {
    const {id} = req.params;
    const userBlogsId = req.user.Blogs;
    try{
        const blog = await Blog.findByIdAndDelete(id);
        // if(!blog){
        //     return res.status(404).json({message:"Blog Not Found"});
        // }
        if(userBlogsId.find(blog => blog == id) === undefined){
            return res.status(403).json({message:"You are not authorized to Delete this blog"});
        }

        return res.status(200).json({message:"Blog Deleted Successfully"});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.getAllBlogs = async (req, res) => {
    try{
        const blogs = await Blog.find({status:"published"});
        return res.status(200).json({message:"Blogs Fetched Successfully",blogs});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.getBlog = async (req, res) => {
    const {id} = req.params;
    try{
        const blog = await Blog.findById(id);
        if(!blog){
            return res.status(404).json({message:"Blog Not Found"});
        }  
        return res.status(200).json({message:"Blog Fetched Successfully",blog});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.getUserBlogs = async (req, res) => {
    const {email} = req.user;
    try{
        const user = await User.findOne({email}).populate("Blogs");
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        // Filter out the blogs that are not published
        const blogs = user.Blogs.filter(blog => blog.status === "draft");
        return res.status(200).json({message:"User Blogs Fetched Successfully",blogs});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

exports.publishBlog = async (req, res) => {
    console.log("Inside Publish Blog");
    const {id}  = req.body;
    const userBlogsId = req?.user?.Blogs;
    try{
        const blog = await Blog.findById(id);
        if(!blog){
            return res.status(404).json({message:"Blog Not Found"});
        }
        if(userBlogsId.find(blog => blog == id) === undefined){
            return res.status(403).json({message:"You are not authorized to update this blog"});
        }
        blog.status = "published";
        await blog.save();
        return res.status(200).json({message:"Blog Published Successfully",blog});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


    