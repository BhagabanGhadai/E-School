
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const quizQuesModel = new mongoose.Schema({

    quiz_question: {
        type: String,
        required: true,
        trim: true
    },
    quiz_question_slug: {
        type: String,
        required: true,
        
    },
    questionImage: {
        type: String,
        
    },

    quizId: {
        type: ObjectId,
        required: true,
        ref:'quiz',
        trim: true
    },

    status:{
        type: Boolean,
        default: 0
    },
    isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("quizQues", quizQuesModel)