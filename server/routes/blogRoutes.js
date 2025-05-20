const express = require("express");
const router = express.Router();

const {createBlog, updateBlog, deleteBlog, getAllBlogs,
     getBlog, getUserBlogs,publishBlog} 
     = require("../controllers/blog.js");

// Middleware to check if user is authenticated
const {auth} = require("../middlewares/auth.js");

router.post("/create", auth, createBlog);
router.post("/save-draft",auth, updateBlog);
router.delete("/delete/:id",auth, deleteBlog);
router.get("/blogs", getAllBlogs);
router.get("/blogs/:id", getBlog);
router.put("/publish", auth, publishBlog);
router.get("/getuserblogs",auth, getUserBlogs);


module.exports = router;