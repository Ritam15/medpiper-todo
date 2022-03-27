const mongoose = require("mongoose");
const userModel = require("../models/user");
const otpModel = require("../models/otp");
const jwt = require("jsonwebtoken");
const JWT = require("../auth/jwt");
const otpGenerator = require("otp-generator");
const client = require("twilio")(
  "AC9a9d54de0c569f8a60819f6c5ac4e621",
  "68b93949a2abd7502185fe92a6cf1920"
);

const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.registerUser = async function (req, res) {
  try {
    const requestBody = req.body;
    const files = req.files;

    const { name, email, phone, password } = requestBody;
    // console.log("A", requestBody);

    let hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      // profileImage
    };
    // console.log("B", userData);
    const newUser = await userModel.create(userData);
    res.status(201).send({ status: true, data: newUser });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.loginPassword = async function (req, res) {
  try {
    const requestBody = req.body;

    const { email, password } = requestBody;

    const user = await userModel.findOne({ email });

    if (!user) {
      res
        .status(401)
        .send({ status: false, message: `Invalid Login Credentials` });
      return;
    }

    const validPassword = await bcrypt.compare(
      requestBody.password,
      user.password
    );

    if (!validPassword) {
      res.status(401).json({ Status: false, message: "Invalid password" });
    }

    const token = await JWT.createToken(user._id);
    res.header("x-auth-key", token);
    res.status(200).send({
      status: true,
      message: "user Login Successfull",
      data: { token },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ Status: false, Msg: error.message });
  }
};

module.exports.loginPhone = async function (req, res) {
  try {
    const requestBody = req.body;

    const { phone } = requestBody;

    const user = await userModel.findOne({ phone });

    if (!user) {
      res
        .status(401)
        .send({ status: false, message: `Phone number not registered` });
      return;
    }

    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const otpInformation = await client.messages.create({
      body: ` login password is ${OTP}`,
      from: +12072887914,
      to: `+91${phone}`,
    });

    console.log(otpInformation);

    const newOtp = await otpModel.create({ otp: OTP });
    return res.status(200).send("Otp send successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send({ Status: false, Msg: error.message });
  }
};

module.exports.otpVerification = async function (req, res) {
  try {
    const requestBody = req.body;
    const { phone, otp } = requestBody;

    const user = await userModel.findOne({ phone });

    if (!user) {
      res
        .status(401)
        .send({ status: false, message: `Phone number not registered` });
      return;
    }

    const otpData = await otpModel.find({ otp: req.body.otp });

    if (otpData.length === 0)
      return res.status(400).send("you used an expired OTP!");

    const rightOtpFind = otpData[otpData.length - 1];

    if (rightOtpFind.otp === req.body.otp) {
      const token = jwt.sign(
        {
          userId: user._id,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
        },
        "Todo"
      );
      res.status(200).send({
        status: true,
        message: "user Login Successfull",
        data: { token },
      });
    } else {
      return res.status(400).send("You otp was wrong!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ Status: false, Msg: error.message });
  }
};

module.exports.updateUser = async function (req, res) {
  try {
    const userId = req.params.userId;
    const requestBody = req.body;

    let user = await userModel.findOne({ _id: userId });

    if (!user) {
      res.status(404).send({ status: false, message: "user not found" });
      return;
    }

    const { name, password } = requestBody;

    const updatedUserData = {};
     if (req.body.hasOwnProperty("name")){
      updatedUserData["name"] = name;
     }
     if (req.body.hasOwnProperty("password")){
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(password, salt);
      updatedUserData["password"] = hashed;
     }

    const updatedData = await userModel.findOneAndUpdate(
      { _id: userId },
      updatedUserData,
      { new: true }
    );
    res.status(200).send({
      status: true,
      message: "Details updated successfully",
      data: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ Status: false, Msg: error.message });
  }
};
