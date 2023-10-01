
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const chapterV2Model = new mongoose.Schema({

    chapter_name: {
        type: String,
        required: true,
        trim: true
    },
    chapter_admin_name: {
        type: String,
        trim: true
    },
    chapter_slug: {
        type: String,
        required: true,
    },
    chapter_desc:{
        type:String,
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

module.exports = mongoose.model("chapterv2", chapterV2Model )