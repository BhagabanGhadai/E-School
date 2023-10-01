const mongoose = require('mongoose');

const whyMankavitModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
       
    },
  isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("whymankavit", whyMankavitModel )