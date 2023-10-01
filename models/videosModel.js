const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const videosModel = new mongoose.Schema({
    chapterId: {
        type: ObjectId,
        required: true,
        ref: 'chapter',
        trim: true
    },
    video:{
        type:String,
        required: true,
    },
    status:{
        type: Boolean,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("videos", videosModel)