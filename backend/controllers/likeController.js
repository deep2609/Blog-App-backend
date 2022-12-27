const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHander = require("../utils/errorhander");

// Like a Blog

exports.likeBlog = catchAsyncError( async (req,res,next)=>{
    if(!req.body.blog){
        return next(new ErrorHander("Blog not found",404));
    }
    req.body.user = req.user.id;
    const blog = await Blog.findById(req.body.blog);

    if(!blog){
        return next(new ErrorHander("Blog not found",404));
    }

    const user = await User.findById(req.body.user);

    if(blog.likes.includes(user._id)){
        return res.status(200).json({
            success:true,
            message: "Blog already liked!",
            blog,
            user
        })
    }

    blog.likes.push(user._id);
    blog.likesCount = blog.likes.length;
    user.likedPosts.push(blog._id);
    await blog.save();
    await user.save();
    res.status(200).json({
        success:true,
        message: "Liked successfully!",
        blog,
        user
    })
    
});

// UnLike a Blog

exports.unlikeBlog = catchAsyncError( async (req,res,next)=>{
    if(!req.body.blog){
        return next(new ErrorHander("Blog not found",404));
    }
    req.body.user = req.user.id;
    const blog = await Blog.findById(req.body.blog);

    if(!blog){
        return next(new ErrorHander("Blog not found",404));
    }

    const user = await User.findById(req.body.user);
    
    if(!blog.likes.includes(user._id)){
        return res.status(200).json({
            success:true,
            message: "Blog unliked!",
            blog,
            user
        })
    }
    const index = blog.likes.indexOf(user._id);
    blog.likes.splice(index,1);
    blog.likesCount = blog.likes.length;
    const userIndex = user.likedPosts.indexOf(blog._id);
    user.likedPosts.splice(userIndex,1);
    
    await blog.save();
    await user.save();

    res.status(200).json({
        success:true,
        message: "Unliked successfully!",
        blog,
        user
    })
    
})