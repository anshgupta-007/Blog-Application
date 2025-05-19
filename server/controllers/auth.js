const User=require("../models/User");
const OTP = require("../models/Otp");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const mailSender=require('../utils/mailSender');
const otpTemplate = require("../mailTemplate/signupotp");
require('dotenv').config();

exports.signUp = async (req,res)=>{
    const {name,email,password,otp}=req.body;
    
    try {
        if(!name || !email || !password || !otp){
            return res.status(400).json({message:"Please Fill All Fields"});
        }
        
        const otpDoc=await OTP.findOne({email});
        if(otpDoc.length===0){
            return res.status(400).json({message:"OTP Not Found"});
        }
        // console.log("OTP Doc : ",otpDoc?.otp);
        // console.log(otp);
        const isMatch= otpDoc.otp==otp;
        if(!isMatch){
            return res.status(400).json({message:"Invalid OTP"});
        }
        
        otpDoc.used=true;
        await otpDoc.save();
        
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User Already Exists"});
        }
        // console.log("Password : ",password);
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await User.create({
            name,
            email,
            password:hashedPassword
        });
        newUser.password=undefined;

        const token=jwt.sign({newUser},process.env.JWT_SECRET,{expiresIn:"1d"});
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:24*60*60*1000
        });

        res.status(200).json({
            success:true,
            message:"User Created Successfully",
            user:newUser
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

exports.login = async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User Not Found"});
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(201).json({message:"Invalid Credentials"});
        }
        
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        // Add the token to headers
        res.setHeader("Authorization",token);
        
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:24*60*60*1000
        });
        console.log("User Logged In Successfully");
        res.status(200).json({
            success:true,
            message:"User Logged In Successfully",
            user:{
                name:user.name,
                email:user.email,
                id:user._id,
            },
            token:token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

exports.logout = async (req,res)=>{
    try {
        res.clearCookie("token");
        res.status(200).json({message:"User Logged Out Successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

exports.sendOtp = async (req,res)=>{
    const {email}=req.body;
    try {
        const user=await User.findOne({email});
        if(user){
            return res.status(201).json({message:"User Already Exists"});
        }

        const oldOtp = await OTP.find({email});
        if(oldOtp){
            const deleteOtp = await OTP.deleteOne({email});
            console.log("Deleted Old OTP");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp); // Example: 345321

        const newOtp = new OTP({email, otp});
        newOtp.save();
        await mailSender(email,"OTP Verification",otpTemplate(otp));
        console.log("OTP: ",newOtp);
        res.status(200).json({message:"OTP Sent Successfully",
            success:true,
        });
    }
    
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}