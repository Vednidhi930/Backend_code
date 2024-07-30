import crypto from "crypto"
import nodeMailer from "nodemailer";




const sendEmail = (req, res) => {
    //3467
  
    //5632     5531     5551 
   
    const randomNumber=crypto.randomInt(0,10000)
    const OTP =String(randomNumber).padStart(4, '5');
    
  
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
      from: "sender@gmail.com", //sender email address
      to: "reciever@gmail.com", // reciver email address
      subject: "OTP Verification",
      text: `Your One Time Password(OTP) is ${OTP}`,
    };
  
    emailProvider.sendMail(receiver, (error, emailResponse) => {
      if (error) {
        res.status(422).json({ message: error });
      } else {
        res.status(200).json({ message: "otp send successfully on your gmail account",emailResponse:emailResponse});
      }
    });
  };