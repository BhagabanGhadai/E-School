const mongoose = require("mongoose");


const student_inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    phone: {
        type: String, 
        required: true, 
        trim: true
    },

 email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    isDeleted:{
        type: Boolean,
        default:false
    },

}, { timestamps: true })




module.exports = mongoose.model("student_inquiry", student_inquirySchema)