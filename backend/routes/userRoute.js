const express = require("express");
const { registerUser, loginUser,logOut, getUserByID } = require("../controllers/userController");

const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/users/:id").get(getUserByID);
router.route("/logout").get(logOut);

module.exports = router;