
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const previousYearQuestion = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    title_slug: {
        type: String,
        required: true,
       
    },

    previousYearId: {
        type: ObjectId,
        required: true,
        ref: 'previousYear',
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

module.exports = mongoose.model("previousYearQuestion", previousYearQuestion )