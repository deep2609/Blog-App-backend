const express = require("express");
const { getAllBlogs, createBlog, updateBlog, deleteBlog, getBlogByID } = require("../controllers/blogController");
const { isAuthenticatedUser } = require("../middleware/auth");


const router = express.Router();

router.route("/posts").get(getAllBlogs).post(isAuthenticatedUser,createBlog);
router.route("/posts/:id").get(getBlogByID).put(isAuthenticatedUser,updateBlog).delete(isAuthenticatedUser,deleteBlog);

module.exports = router;