const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const courseBatchModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
       
    },
    courseId: {
        type: ObjectId,
        required: true,
        ref: 'course',
        trim: true
    },

    isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("courseBatch", courseBatchModel)