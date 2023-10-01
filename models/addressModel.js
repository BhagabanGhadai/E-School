const mongoose= require('mongoose')

const addressSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    address:{
        type: String,
        required: true,
    },

    city:{
        type: String,
        required: true,
        trim: true
    },

    state:{
        type: String,
        required: true,
        trim: true
    },
    country:{
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type:String, 
        trim: true
    }, status:{
        type: Boolean,
        default: 0
    },
    isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("address", addressSchema)