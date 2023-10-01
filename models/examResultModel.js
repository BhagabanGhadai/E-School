const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const examResultModel = new mongoose.Schema({

    examCourseId: {
        type: ObjectId,
        required: true,
        ref:'examCourse',
        trim: true
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: 'user',
      trim: true
  },
 
  answer: [{
    examQuesId: {
      type: String,
      required: true,
      trim: true
    },
    examAnsId: {
      type: String,
      required: true,
      trim: true
    },
    _id: false
  }],
    isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("examResult", examResultModel)
