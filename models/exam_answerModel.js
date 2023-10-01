
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const examAnswerModel = new mongoose.Schema({

    exam_answer: {
        type: String,
        required: true,
        trim: true
    },
    isCorrect:{
        type: Boolean,
        default:false
    },
 
    examQuesId: {
        type: ObjectId,
        required: true,
        ref: 'exam-Question',
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

module.exports = mongoose.model("exam-Answer", examAnswerModel )