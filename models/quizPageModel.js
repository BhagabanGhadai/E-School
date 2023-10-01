
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const quizPageModel = new mongoose.Schema({
    quizId: {
        type: ObjectId,
        required: true,
        ref:'quiz',
        trim: true
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

module.exports = mongoose.model("quizPage", quizPageModel)