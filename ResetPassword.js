import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";


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
  