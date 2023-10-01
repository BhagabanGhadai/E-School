const entranceModel = require('../models/entranceModel')
const courseModel = require('../models/courseModel')


const { isRequired, isInvalid, isValid} = require("../utils/entranceValidation")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const mongoose = require('mongoose')

// //-------------------------------------------------API-1 [/add ]--------------------------------------------------//

const addEntrance = async function (req, res) {
   
    try {
        let data = req.body
       
     
        let error = []
        let err1 = isRequired(data)
        if (err1)
            error.push(...err1)


        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })
      
           
       let created = await entranceModel.create(data)
        res.status(201).send({ status: true, message: " created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================================== Get By ID===================================================================//
const getEntranceById = async (req, res) => {
    try {
        const data = req.body.entranceId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild entranceId" })
        }
        //find the entranceId which is deleted key is false--
        let check = await entranceModel.findOne({ _id: data, isDeleted: false })

        if (!check) {
            return res.status(404).send({ status: false, message: "Not Available!!" })
        }
        return res.status(200).send({ status: true,  message: 'Success', data: check })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get All Course Batch ===================================================================//

const getAllEntrance = async function (req, res) {
    try {

        let Present = await entranceModel.find({isDeleted: false })
        res.status(200).send({status:true, data: Present})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}



// //--------------------------------------------------------- Update  Api -------------------------------------------------------//

const updateEntrance = async (req, res) => {

  const {entranceId} = req.body;

    const data = {
        exam_name:req.body.exam_name,
        description:req.body.description,
        syllabus:req.body.syllabus,
        question_format:req.body.question_format,
        course_duration:req.body.course_duration,

        
     }
   
 const updatedData = await entranceModel.findOneAndUpdate({_id:entranceId}, data, {new: true});
    return res.status(201).json({ updatedData: updatedData });
}

// ------------------------------------ Delete courseBatch ----------------------------------

const deleteEntrance = async function (req, res) {
    try {
        const entranceId = req.body.entranceId
        if (!isValidObjectId(entranceId)) {
            return res.status(400).send({ status: false, msg: " invalid entranceId " });
        }
        const deletedDetails = await entranceModel.findOneAndUpdate(
            { _id: entranceId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (!deletedDetails) {
            return res.status(404).send({ status: false, message: 'course Batch Id does not exist' })
        }
        return res.status(200).send({ status: true, message: 'course Batch deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {addEntrance,getEntranceById,getAllEntrance,updateEntrance,deleteEntrance}