const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId


const quizv2Schema = new mongoose.Schema({
   quiz_title: {
        type: String,
        trim:true,
        required: true
    },
    quiz_slug:{
        type: String,
        required: true,
       
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    max_attempt:{
        type: Number,
        default: 1,
        required: true,
       
    },
    max_mark:{
        type: Number,
        default: 1,
        required: true,
    },
    start:{
        type: String,
        required: true,
    },
    end:{
        type: String,
        required: true,
    },
    page_count:{
        type: Number,
        default: 10,
        required: true,
    },
    sequence:{
        type: Number,
        default: 1,
        required: true,
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

module.exports = mongoose.model('quizv2',quizv2Schema )