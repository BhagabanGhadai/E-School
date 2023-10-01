
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const quizQuestionV2Model = new mongoose.Schema({

    quizId: {
        type: ObjectId,
        required: true,
        ref:'quiz',
        trim: true
    },
    quizPageId: {
        type: ObjectId,
        required: true,
        ref:'quizPage',
        trim: true
    },
    quiz_question: {
        type: String,
        required: false,
        trim: true
    },
    quiz_question_slug: {
        type: String,
        required: false,
        
    },
    description: {
        type: String,
        trim: true
    },
    correct_answer_info: {
        type: String
    },
    type: {
        type: String
    },
    sequence:{
        type: Number,
        default: 1,
        required: false,
    },
    mark:{
        type: Number,
        default: 0,
        required: false,
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

module.exports = mongoose.model("quizQuestionv2", quizQuestionV2Model)