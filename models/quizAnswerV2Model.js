const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const quizAnswerV2Model = new mongoose.Schema({
    quizId: {
        type: ObjectId,
        required: true,
        ref: 'quizQues',
        trim: true
    },
    quizQuestionId: {
        type: ObjectId,
        required: true,
        ref: 'quizQues',
        trim: true
    },
    quiz_answer: {
        type: String,
        required: true,
        trim: true
    },
    isCorrect:{
        type: Boolean,
        default:false
    },
    marks:{
        type: Number,
        default: 0,
        required: true,
    },
    sequence:{
        type: Number,
        default: 1,
        required: true,
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

module.exports = mongoose.model("quizanswerv2", quizAnswerV2Model)