
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const mockCourseModel = new mongoose.Schema({
    mockId: {
        type: ObjectId,
        required: true,
    },
    courseId: {
        type: ObjectId,
        required: true,
        ref: 'course',
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
      required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("mockCourse", mockCourseModel )