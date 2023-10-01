const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const videoModel = new mongoose.Schema({

    video_name: {
        type: String,
        required: true,
        trim: true
    },
    video_slug: {
        type: String,
        required: true,
       
    },

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

module.exports = mongoose.model("video", videoModel)