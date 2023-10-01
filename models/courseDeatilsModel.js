
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const batchDetailsModel = new mongoose.Schema({

    courseId: {
        type: ObjectId,
        required: true,
        ref: 'course',
        trim: true
    },
 
    batchHighlight:{
        type: [{type:String,trim: true}],
        required: true,
    },
    facultyDegree:{
        type: [{type:String,trim: true}],
        required: true,
    },

    isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("batchDetails", batchDetailsModel )