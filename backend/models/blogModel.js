const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter a title"],
        maxLength: [50, "Title should be less than equal to 50 characters"],
    },
    category: {
        type: String,
        required: [true, "Please enter a category"],
        maxLength: [50, "Category should be less than equal to 50 characters"],
    },
    content: {
        type: String,
        required: [true, "Please enter content"],
        maxLength: [5000, "Content should be less than equal to 500 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Comment"
        }
    ],
    likesCount:{
        type:Number,
        default: 0
    },
    commentsCount:{
        type:Number,
        default: 0
    }

})

module.exports = mongoose.model("Blog", blogSchema);