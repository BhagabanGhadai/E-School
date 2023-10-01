const mongoose = require("mongoose");

const entranceModel = new mongoose.Schema({
    exam_name: {
        type: String,
        required: true,
        trim: true

    },

   description: {
    type: String,
    required: true,
    trim: true
    },
    syllabus: {
        type: String,
        required: true,
        trim: true

    },
    question_format: {
        type: String,
        required: true,
        trim: true

    },
    course_duration: {
        type: String,
        required: true,
        trim: true

    },


    isDeleted:{
        type: Boolean,
        default:false
    }

}, { timestamps: true })

module.exports = mongoose.model("entrance", entranceModel)