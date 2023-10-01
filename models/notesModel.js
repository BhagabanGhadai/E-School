
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const notesModel = new mongoose.Schema({

    notes_name: {
        type: String,
        required: true,
        trim: true
    },
    notes_slug: {
        type: String,
        required: true,
       
    },

    chapterId: {
        type: ObjectId,
        required: true,
        ref: 'chapter',
        trim: true
    },
    pdf:{
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

module.exports = mongoose.model("notes", notesModel )