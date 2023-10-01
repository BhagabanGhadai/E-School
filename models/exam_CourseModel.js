
const mongoose = require('mongoose');

const examCourseModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    title_slug: {
        type: String,
        required: true,
       
    },
   
    description: {
        type: String,
        required: true,
       
    },

    price: {
        type: Number,
        required: true,
       
    },
    mrp: {
        type: Number,
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

module.exports = mongoose.model("examCourse", examCourseModel )