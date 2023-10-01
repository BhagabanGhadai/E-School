const mongoose = require('mongoose');

const previousYear = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    title_slug: {
        type: String,
        required: true,
       
    },
    description:{
        type: String,
        required: true,
       
    },
    image:{
        type: String,
        required: true,
    },
  

  isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("previousYear", previousYear )