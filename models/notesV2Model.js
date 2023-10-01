
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const notesV2Model = new mongoose.Schema({

    notes_name: {
        type: String,
        required: true,
        trim: true
    },
    notes_slug: {
        type: String,
        required: true,
       
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

module.exports = mongoose.model("notesV2", notesV2Model )