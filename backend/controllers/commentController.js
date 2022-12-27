const Comment = require("../models/commentModel");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHander = require("../utils/errorhander");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");

// Get All Comments

exports.getAllComments = catchAsyncError(async (req,res,next)=>{
    // console.log(JSON.stringify(req.user._id));
    const apifeatures = new ApiFeatures(Comment.find(),req.query).search();
    const comments = await apifeatures.query;
    res.status(200).json({
        success:true,
        comments
    })
});

// Create A Comment

exports.createComment = catchAsyncError(async (req,res,next) => {
    req.body.user = req.user.id;
    
    const blog = await Blog.findById(req.body.blog);
    if(!blog){
        return next(new ErrorHander("Blog doesn't exist.",404));
    }

    const comment = await Comment.create(req.body);
    const user = await User.findById(req.user.id);
    

    user.comments.push(comment._id);
    blog.comments.push(comment._id);
    blog.commentsCount = blog.comments.length;
    await user.save();
    await blog.save();
    res.status(201).json({
        success:true,
        comment
    })
});

// Get a comment by ID
exports.getCommentByID = catchAsyncError(async (req,res,next) => {
    let comment = await Comment.findById(req.params.id);
    if(!comment){
        return next(new ErrorHander("Comment not found!!",404));
    }

    res.status(200).json({
        success:true,
        comment
    })
})

// Update A Comment

exports.updateComment = catchAsyncError(async (req,res,next) => {
    let comment = await Comment.findById(req.params.id);

    if(!comment){
        return next(new ErrorHander("Comment not found!!",404));
    }

    comment = await Comment.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindandModify:false
    });
    res.status(200).json({
        success:true,
        message:"Updated successfully",
        comment
    })
});

// Delete a comment

exports.deleteComment = catchAsyncError(async (req,res,next) => {
    let comment = await Comment.findById(req.params.id);
    if(!comment){
        return next(new ErrorHander("Comment not found!!",404));
    }

    const user = await User.findById(req.user.id);
    const index = user.comments.indexOf(comment._id);
    
    user.comments.splice(index,1);
 
    await user.save();

    const blog = await Blog.findById(req.body.blog);
    const blogIndex = blog.comments.indexOf(comment._id);

    blog.comments.splice(blogIndex,1);
    blog.commentsCount = blog.comments.length;

    await blog.save();


    await comment.remove();
    res.status(200).json({
        success:true,
        message:"Deleted successfully"
    });
});