const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const quizAnsModel = new mongoose.Schema({

    quiz_answer: {
        type: String,
        required: true,
        trim: true
    },
    quiz_answer_slug: {
        type: String,
        required: true,
       
    },
    isCorrect:{
        type: Boolean,
        default:false
    },

    quizQuesId: {
        type: ObjectId,
        required: true,
        ref: 'quizQues',
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

module.exports = mongoose.model("quizanswer", quizAnsModel)