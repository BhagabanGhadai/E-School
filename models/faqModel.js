const mongoose = require('mongoose');

const faqModel = new mongoose.Schema({

    faq_question: {
        type: String,
        required: true,
        trim: true
    },
    faq_answer: {
        type: String,
        required: true,
       
    },
  isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("faq", faqModel )