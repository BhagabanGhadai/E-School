
const mongoose = require('mongoose');

const notificationModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
   
    description: {
        type: String,
        required: true,
       
    },

    image:{
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

module.exports = mongoose.model("notification", notificationModel )