const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const sendToken = require("../utils/jwtToken");

//Register a user (sign up)
exports.registerUser = catchAsyncErrors( async(req,res,next) => {
    const {name,email,password}  = req.body;
    const user = await User.create({
        name,email,password
    });
    sendToken(user,201,res);
});

//Login User

exports.loginUser = catchAsyncErrors( async(req,res,next)=>{
    const {email,password} = req.body;

    //checking if user has given email and password both
    if(!email || !password){
        return next(new ErrorHander("Please enter email and password",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHander("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password",401));
    }
    sendToken(user,200,res);
});

//Logout user

exports.logOut = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success:true,
        message: "Logged Out"
    })
})

//get user by id

exports.getUserByID = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHander("User doesn't exist",404));
    }
    res.status(200).json({
        success:true,
        user
    })
})