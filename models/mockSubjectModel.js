
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const mockSubjectModel = new mongoose.Schema({
    mockId: {
        type: ObjectId,
        required: true,
    },
    subjectId: {
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
      required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("mockSubject", mockSubjectModel )