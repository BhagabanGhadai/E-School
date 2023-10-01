
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const examQuestionModel = new mongoose.Schema({

    exam_question: {
        type: String,
        required: true,
        trim: true
    },
    exam_type:{
        type:String, 
        required:true,
        enum:['objective', 'subjective'],
    },
 
    examCourseId: {
        type: ObjectId,
        required: true,
        ref: 'examCourse',
        trim: true
    },
    questionImage: {
        type: String,
        
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

module.exports = mongoose.model("exam-Question", examQuestionModel )