const mongoose= require('mongoose')

const courseSchema = new mongoose.Schema({
    course_title:{
        type: String,
        required: true,
        trim: true
    },
    course_admin_title:{
        type: String,
        trim: true
    },
    course_slug:{
        type: String,
        required: true,
       
    },

    short_description:{
        type: String,
        required: true,
        trim: true
    },

    detail_description:{
        type: String,
        required: true,
        trim: true
    },
    highlights:{
        type: String,
        required: true,
        trim: true
    },
    price:{
        type: String,
        required: true,
        trim: true
    },
    mrp:{
        type: String,
        required: true,
        trim: true
    },

    thumbnail:{
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

module.exports = mongoose.model("course", courseSchema)