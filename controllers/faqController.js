const faqModel = require('../models/faqModel')

const { isRequired, isInvalid, isValid} = require("../utils/faqValidation")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const mongoose = require('mongoose')

// //-------------------------------------------------API-1 [/add why faq]--------------------------------------------------//

const addFaq = async function (req, res) {
   
    try {
        let data = req.body
 
        let error = []
        let err1 = isRequired(data)
        if (err1)
            error.push(...err1)


        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })
      
           
       let created = await faqModel.create(data)
        res.status(201).send({ status: true, message: "faqModel created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================================== Get faq ===================================================================//
const getfaqById = async (req, res) => {
    try {
        const data = req.body.faqId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild faqId" })
        }
        //find the whyfaqId which is deleted key is false--
        let faq = await faqModel.findOne({ _id: data, isDeleted: false })

        if (!faq) {
            return res.status(404).send({ status: false, message: "No faqs Available!!" })
        }
        return res.status(200).send({ status: true,  message: 'Success', data: faq })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get All faq ===================================================================//

const getAllfaq = async function (req, res) {
    try {

        let faqPresent = await faqModel.find({isDeleted: false })
        res.status(200).send({status:true, data: faqPresent})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}



// //--------------------------------------------------------- Update faq Api -------------------------------------------------------//

const updatefaq = async (req, res) => {

  const {faqId} = req.body;

    const data = {
        faq_question:req.body.faq_question,
        faq_answer:req.body.faq_answer,
     }
   
 const updatedData = await faqModel.findOneAndUpdate({_id:faqId}, data, {new: true});
    return res.status(201).json({ updatedData: updatedData });
}

// ------------------------------------ Delete faq ----------------------------------

const deletefaq = async function (req, res) {
    try {
        const faqId = req.body.faqId
        if (!isValidObjectId(faqId)) {
            return res.status(400).send({ status: false, msg: " invalid faqId " });
        }
        const deletedDetails = await faqModel.findOneAndUpdate(
            { _id: faqId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (!deletedDetails) {
            return res.status(404).send({ status: false, message: 'faqId does not exist' })
        }
        return res.status(200).send({ status: true, message: 'faq deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {addFaq,getfaqById,getAllfaq,updatefaq,deletefaq}