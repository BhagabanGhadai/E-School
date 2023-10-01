const mongoose = require('mongoose');

const examModel = new mongoose.Schema({

    exam_name: {
        type: String,
        required: true,
        trim: true
    },
    exam_slug: {
        type: String,
        required: true,
       
    },
    correct_mark: {
        type: Number,
        
       
    },
    incorrect_mark: {
        type: Number,
       
       
    },
    description: {
        type: String,
        required: true,
       
    },
  isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("exam", examModel )