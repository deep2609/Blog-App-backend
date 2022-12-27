const Blog = require("../models/blogModel");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHander = require("../utils/errorhander");
const User = require("../models/userModel");

// Get All Blogs

exports.getAllBlogs = catchAsyncError(async (req,res,next)=>{
    // console.log(JSON.stringify(req.user._id));
    const resultsPerPage = 5;
    const apifeatures = new ApiFeatures(Blog.find(),req.query).search().filter().orderBy().pagination(resultsPerPage);
    let blogs = await apifeatures.query;

    res.status(200).json({
        success:true,
        blogs
    })
});

// Create A Blog

exports.createBlog = catchAsyncError(async (req,res,next) => {
    req.body.user = req.user.id;
    const blog = await Blog.create(req.body);
    const user = await User.findById(req.user.id);
    user.blogs.push(blog._id);
    await user.save();
    res.status(201).json({
        success:true,
        blog
    })
});

// Get a blog by ID
exports.getBlogByID = catchAsyncError(async (req,res,next) => {
    let blog = await Blog.findById(req.params.id);
    if(!blog){
        return next(new ErrorHander("Blog not found!!",404));
    }

    res.status(200).json({
        success:true,
        blog
    })
})

// Update A Blog

exports.updateBlog = catchAsyncError(async (req,res,next) => {
    let blog = await Blog.findById(req.params.id);

    if(!blog){
        return next(new ErrorHander("Blog not found!!",404));
    }
    if(blog.user !== req.user.id){
        return next(new ErrorHander("You can not edit this blog.",401));
    }

    blog = await Blog.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindandModify:false
    });
    res.status(200).json({
        success:true,
        message:"Updated successfully",
        blog
    })
});

// Delete a blog

exports.deleteBlog = catchAsyncError(async (req,res,next) => {
    let blog = await Blog.findById(req.params.id);
    if(!blog){
        return next(new ErrorHander("Blog not found!!",404));
    }

    if(blog.user !== req.user.id){
        return next(new ErrorHander("You can not delete this blog.",401));
    }

    const user = await User.findById(req.user.id);
    const index = user.blogs.indexOf(blog._id);
    user.blogs.splice(index,1);

    await user.save();

    await blog.remove();
    res.status(200).json({
        success:true,
        message:"Deleted successfully"
    });
});