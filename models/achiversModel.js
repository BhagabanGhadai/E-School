
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const achiversModel = new mongoose.Schema({

    student_name: {
        type: String,
        required: true,
        trim: true
    },
    student_rank: {
        type: String,
        required: true,
         trim: true
    },
   
examId: {
        type: ObjectId,
        required: true,
        ref: 'exam',
        trim: true
    },

    image:{
        type:String,
        required: true,
    },

    isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("achiver", achiversModel )