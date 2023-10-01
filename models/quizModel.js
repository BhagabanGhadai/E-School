const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId


const quizSchema = new mongoose.Schema({
   quiz_title: {
        type: String,
        trim:true,
        required: true
    },
    quiz_slug:{
        type: String,
        required: true,
       
    },
    correct_mark:{
        type: Number,
        default: 0,
        required: true,
       
    },
    incorrect_mark:{
        type: Number,
        default: 0,
        required: true,
       
    },
    short_description:{
        type: String,
        required: true,
        trim: true
    },
    duration:{
        type: String,
        trim: true
    },
    note:{
        type: String,
        trim: true
    },
    image:{
        type:String,
        trim:true
    },
      chapterId: {
        type: ObjectId,
        required: true,
        ref: 'chapter',
        trim: true
    },
    status:{
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{timestamps: true });

module.exports = mongoose.model('quiz',quizSchema )