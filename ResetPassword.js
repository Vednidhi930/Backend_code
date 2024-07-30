import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodeMailer from "nodemailer";
import crypto from "crypto"


// Email verification
const EmailVerification=async(req,res)=>{

    const{email}=req.body
    console.log(email)
  
    const user=await userModel.findOne({email})
     if(!user){
      res.status(422).json({message:"Email does not exist"})
     }else{
       
      const randomNumber=crypto.randomInt(0,10000)
      const OTP =String(randomNumber).padStart(4, '5');
  
      const resetToken = jwt.sign({email,OTP}, JWT_SECRET_KEY);
  
    
      const emailProvider = nodeMailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465, // gmail by default port is 465
        auth: {
          user: "shanukumar7988@gmail.com",
          pass:"qoddpqeklnzuluyd", // fir apko gmail ka password dena hai kuch aisa agr aapke gmail pe 2 step authentication on h to
        },
        tls: { rejectUnauthorized: false },
      });
    
      const receiver = {
        from: "shanukumar7988@gmail.com",
        to: email,
        subject: "OTP Verification",
        text: `Your One Time Password(OTP) is ${OTP}`,
      };
    
      emailProvider.sendMail(receiver, (error, emailResponse) => {
        if (error) {
          res.status(422).json({ message: error });
          console.log(error)
        } else {
          const options = {
            expire:new Date(Date.now()+60 * 1000),
            httpOnly: true,
            secure: true,
          };
          res
            .cookie("resetpassToken",resetToken, options)
            .status(200)
            .json({message:"OTP send on your Email Address"})
        }
      });
   
     }
  }

  // otp verification
  
  const otpverification=async(req,res)=>{
    const{otp}=req.body
    const userOtp=req.cookies.resetpassToken
    if(!userOtp){
      res.status(422).json({message:"token expired"})
    }else{
      const user=jwt.verify(userOtp, JWT_SECRET_KEY)
      const checkOtp=user.OTP
      if(checkOtp===otp){
        res.status(200).json({message:"Otp verified"})
      }else{
        res.status(422).json({message:"Invalid otp"})
      }
    }
    
  }
   

  //change password
  const changepassword=async(req,res)=>{
    const{password}=req.body
  
    const hashPassowrd = await bcrypt.hash(password, 10);
  
    const resetToken=req.cookies.resetpassToken
  
    if(!resetToken){
      res.json({message:"Token Expired"}).status(422)
    }else{
      const checkToken = jwt.verify(resetToken, JWT_SECRET_KEY);
      
      const email=checkToken.email
      if(!email){
        res.json(422).json({message:"Email is not verified"})
      }else{
        
        const user=await userModel.findOne({email})
        user.password=hashPassowrd
        await user.save()
        res
        .clearCookie("resetpassToken")
        .status(200)
        .json({message:"Password has been changed"})
      }
    }
  }