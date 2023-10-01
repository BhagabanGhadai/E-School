const mongoose = require("mongoose");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true

    },
    father_name: {
        type: String,
    },
    father_occupation: {
        type: String,
    },
    phone: {
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,

    },
    confirm_password: {
        type: String,
        required: true,
        trim: true,
    },
    otp: {
        type: Number,
        required: true,
      },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
      },
    birthday: {
        type: String,
    },
    present_address: {
        type: String,
    },
    current_occupation: {
        type: String,
    },
    college_name: {
        type: String,
    },
    enter_year: {
        type: String,
    },
    other_occupation: {
        type: String,
    },
    reference: {
        type: String,
    },
    others: {
        type: String,
    },
    profile_photo: {
        type: String,
    },
    document_type: {
        type: String,
    },
    kyc_document: {
        type: String,
    },
    kyc_status: {
        type: Number,
        enum:[0,1,2],
        default:0,
        required: true,
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
    force_logout_status:{
        type: Boolean,
        default:false
    },
    status:{
        type: Boolean,
        default:true
    },
    passwordResetToken: String,
    passwordResetExpires: Date,

}, { timestamps: true })



// Instance method for generating password reset tokens
userSchema.methods.generatePasswordResetToken = function () {
// Generate a random token
const token = crypto.randomBytes(20).toString('hex');

// Set the token and expiration date on the user object
this.passwordResetToken = token;
this.passwordResetExpires = Date.now() + 3600000; // Token expires in 1 hour

// Return the token
return token;
};

module.exports = mongoose.model("user", userSchema)