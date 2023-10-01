
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const courseSubjectModel = new mongoose.Schema({
    courseId: {
        type: ObjectId,
        required: true,
        ref: 'course',
        trim: true
    },
    chapterId: {
        type: ObjectId,
        required: true,
        ref: 'chapterv2',
        trim: true
    },
    removeStatus:{
        type: Boolean,
        default: false
    },
    status:{
        type: Boolean,
        default: false
    },
    sequence: {
        type: Number,
        default: 0,
        required: true,
      },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("courseSubject", courseSubjectModel )