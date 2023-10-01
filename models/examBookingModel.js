const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const examBookingModel = new mongoose.Schema({
 
    userId: {
        type: ObjectId,
        required: true,
        ref: 'user',
        trim: true
    },
    examCourseId: {
        type: ObjectId,
        required: true,
        ref: 'examCourse',
        trim: true
    },
    orderId: {
        type: String,
        required: true,
       

    },
    transactionId: {
        type: String,
        required: true,
       

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

module.exports = mongoose.model("examBooking", examBookingModel )