const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema({


 email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    isDeleted:{
        type: Boolean,
        default:false
    }

}, { timestamps: true })

module.exports = mongoose.model("newsLetter", newsLetterSchema )