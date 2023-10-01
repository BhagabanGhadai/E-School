const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const bookingModel = new mongoose.Schema({
 
user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
  orderId:{
    type:String,
    required: true,
},
transactionId:{
    type:String,
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

module.exports = mongoose.model("booking", bookingModel )


  