const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId

const user_macAddressModel = new mongoose.Schema({
    macAddress: {
        type: String,
        required: true,
       
    },
    isDevice: {
        type:String, 
        required:true,
        enum:["mobile", "laptop"],
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: 'user',
        trim: true
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

module.exports = mongoose.model("user_macAddress", user_macAddressModel)