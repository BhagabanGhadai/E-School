const fingerprintModel = require('../models/fingerprintModel')


const { isRequired,  isValid} = require("../utils/fingerprintValidation")

const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


// //------------------------------------------------- API-1 [/Add fingerprint] --------------------------------------------------//

const addfingerprint= async function (req, res) {
   
    try {
        let data = req.body
      
        let error = []
        let err1 = isRequired(data)
        if (err1)
            error.push(...err1)


        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })
      
        let created = await fingerprintModel.create(data)
        res.status(201).send({ status: true, message: "fingerprint created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
// -------------------------------------------get fingerprint---------------------------------

const getfingerprint = async function (req, res) {
    try {
  
        let Present = await fingerprintModel.find({isDeleted: false })
        res.status(200).send({status:true, data: Present})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
  }
// ---------------------------------------------update-------------------------------------------

const fingerprintUpdate = async function (req, res) {
    try {

        const { fingerprintId,fingerprint } = req.body;

        const data = {
          fingerprint,
         
        }
     
        
        const updatedData = await fingerprintModel.findOneAndUpdate({ _id: fingerprintId }, data, { new: true });
        return res.status(201).json({ updatedData: updatedData });

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}
module.exports = {addfingerprint,getfingerprint,fingerprintUpdate}
