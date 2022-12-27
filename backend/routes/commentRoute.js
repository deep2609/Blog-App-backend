const express = require("express");
const { getAllComments, createComment, getCommentByID, updateComment, deleteComment } = require("../controllers/commentController");

const { isAuthenticatedUser } = require("../middleware/auth");


const router = express.Router();

router.route("/comments").get(getAllComments).post(isAuthenticatedUser,createComment);
router.route("/comments/:id").get(getCommentByID).put(isAuthenticatedUser,updateComment).delete(isAuthenticatedUser,deleteComment);

module.exports = router;