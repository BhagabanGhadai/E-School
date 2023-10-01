const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const quizResultModel = new mongoose.Schema({

    quizId: {
        type: ObjectId,
        required: true,
        ref:'quiz',
        trim: true
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: 'user',
      trim: true
  },
 
    answer: [{
      quizQuesId: {
          type: String,
          required: true,
          trim: true
        },
        answerId: {
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

module.exports = mongoose.model("quizResult", quizResultModel)
