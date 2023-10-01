const mongoose = require("mongoose");

const getInTouchSchema = new mongoose.Schema({
    name: {
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
    message: {
        type: String,
        required: true,
        trim: true

    },
    isDeleted:{
        type: Boolean,
        default:false
    }

}, { timestamps: true })

module.exports = mongoose.model("getInTouch", getInTouchSchema)