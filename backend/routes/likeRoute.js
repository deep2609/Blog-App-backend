const express = require("express");
const { likeBlog, unlikeBlog } = require("../controllers/likeController");
const { isAuthenticatedUser } = require("../middleware/auth");


const router = express.Router();

router.route("/like").post(isAuthenticatedUser,likeBlog);
router.route("/unlike").post(isAuthenticatedUser,unlikeBlog);

module.exports = router;