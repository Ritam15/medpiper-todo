const mongoose=require('mongoose');
const userModel=require('../models/user')
const jwt= require('jsonwebtoken')
const JWT= require('../auth/jwt')


// const nodemailer = require('nodemailer');
  
const generateOTP = () => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };  
const bcrypt = require('bcrypt')
const saltRounds = 10


module.exports.registerUser=async function(req, res){
try {
const requestBody=req.body;
const files=req.files;

const {name, email,phone,password}=requestBody;

let hashedPassword = await bcrypt.hash(password, saltRounds)
const userData = {
    name,
    email,
    phone,
    password: hashedPassword,
    // profileImage
};
const newUser = await userModel.create(userData)
res.status(201).send({ status: true, data: newUser })
} catch (err) {
res.status(500).send({ status: false, msg: err.message })
}
}

module.exports.loginPassword = async function (req, res) {
    try {
        const requestBody = req.body;
       

        const { email, password } = requestBody;

        const user = await userModel.findOne({ email });

        if (!user) {
            res.status(401).send({ status: false, message: `Invalid Login Credentials` })
            return
        };

        const validPassword = await bcrypt.compare(requestBody.password, user.password);

        if (!validPassword) {
            res.status(401).json({ Status: false, message: "Invalid password" });
        }

        const token = await JWT.createToken(user._id);
        res.header('x-api-key', token);
        res.status(200).send({ status: true, message: 'user Login Successfull', data: { token } });

    } catch (error) {
        console.log(error)
        res.status(500).send({ Status: false, Msg: error.message })
    }
}


// const login = async function (req, res) {                             //https://www.geeksforgeeks.org/email-verification-using-otp-in-nodejs/
//     try {
//         const requestBody = req.body

//         //Extract Body
//         let { email, phone } = requestBody
//         let otp=generateOTP()
      
//         if(email){

//         let user = await userModel.findOne({ email: email })

//         if (!user) {
//             return res.status(400).send({ status: false, message: "no such user with this email id found" })
//         }
       

        
//         let mailTransporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: "rsrr2238@gmail.com",
//                 pass: "zxcvbnm@",
//             }
//         });
          
//         let mailDetails = {
//             from: 'rsrr2238@gmail.com',
//             to: `${user.email}`,
//             subject: 'Otp mail',
//             text: `Otp is  ${otp}`
//         };
          
//         mailTransporter.sendMail(mailDetails, function(err, data) {
//             if(err) {
//                 console.log('Error Occurs');
//             } else {
//                 console.log('Email sent successfully');
//             }
//         });

//         return res.status(200).send("Otp send successfully!");
//     }
// const otpNew = await otpModel.create({ otp: OTP });

//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message })
//     }
// }





  


