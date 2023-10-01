
const mongoose = require('mongoose');


const testinomialModel = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    rank: {
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

    isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("testinomial", testinomialModel )