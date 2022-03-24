const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    otp: { type: String, required: true },
    createdAt: { type: Date },
    expireAt: { type: Date },
});

module.exports = mongoose.model('Otp', otpSchema);
