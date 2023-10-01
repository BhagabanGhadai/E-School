const whyMankavitModel = require('../models/whyMankavitModel')

const { isRequired, isInvalid, isValid} = require("../utils/whyMankavitValidation")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const mongoose = require('mongoose')

// //-------------------------------------------------API-1 [/add why mankavit]--------------------------------------------------//

const addWhyMankavit = async function (req, res) {
   
    try {
        let data = req.body
       
     

     

      
        let error = []
        let err1 = isRequired(data)
        if (err1)
            error.push(...err1)


        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })
      
           
       let created = await whyMankavitModel.create(data)
        res.status(201).send({ status: true, message: "whyMankavitModel created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================================== Get Mankavit ===================================================================//
const getMankavitById = async (req, res) => {
    try {
        const data = req.body.mankavitId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild mankavitId" })
        }
        //find the whyMankavitId which is deleted key is false--
        let mankavit = await whyMankavitModel.findOne({ _id: data, isDeleted: false })

        if (!mankavit) {
            return res.status(404).send({ status: false, message: "No Mankavits Available!!" })
        }
        return res.status(200).send({ status: true,  message: 'Success', data: mankavit })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get All Mankavit ===================================================================//

const getAllMankavit = async function (req, res) {
    try {

        let mankavitPresent = await whyMankavitModel.find({isDeleted: false })
        res.status(200).send({status:true, data: mankavitPresent})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}



// //--------------------------------------------------------- Update Mankavit Api -------------------------------------------------------//

const updateMankavit = async (req, res) => {

  const {mankavitId} = req.body;

    const data = {
        title:req.body.title,
        description:req.body.description,
     }
   
 const updatedData = await whyMankavitModel.findOneAndUpdate({_id:mankavitId}, data, {new: true});
    return res.status(201).json({ updatedData: updatedData });
}

// ------------------------------------ Delete Mankavit ----------------------------------

const deleteMankavit = async function (req, res) {
    try {
        const mankavitId = req.body.mankavitId
        if (!isValidObjectId(mankavitId)) {
            return res.status(400).send({ status: false, msg: " invalid mankavitId " });
        }
        const deletedDetails = await whyMankavitModel.findOneAndUpdate(
            { _id: mankavitId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (!deletedDetails) {
            return res.status(404).send({ status: false, message: 'mankavitId does not exist' })
        }
        return res.status(200).send({ status: true, message: 'Mankavit deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {addWhyMankavit,getMankavitById,getAllMankavit,updateMankavit,deleteMankavit}