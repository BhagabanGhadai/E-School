
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const faculty_degreeModel = new mongoose.Schema({

    university: {
        type: String,
        required: true,
        trim: true
    },
   
    short_description: {
        type: String,
        required: true,
       
    },

    image:{
        type:String,
        required: true,
    },
    facultyId: {
        type: ObjectId,
        required: true,
        ref: 'faculty',
        trim: true
    },

    isDeleted:{
        type: Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("faculty_degree", faculty_degreeModel )