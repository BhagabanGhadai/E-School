const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const courseBatchHighlightModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    courseBatchId: {
        type: ObjectId,
        required: true,
        ref: 'courseBatch',
        trim: true
    },
  isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("courseBatchHighlight", courseBatchHighlightModel )