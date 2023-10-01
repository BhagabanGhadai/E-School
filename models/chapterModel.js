
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const chapterModel = new mongoose.Schema({

    chapter_name: {
        type: String,
        required: true,
        trim: true
    },
    chapter_slug: {
        type: String,
        required: true,
       
    },
    courseId: {
        type: ObjectId,
        required: true,
        ref: 'course',
        trim: true
    },
    image:{
        type:String,
        required: true,
    },
    showCase:{
        type:String,
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

module.exports = mongoose.model("chapter", chapterModel )