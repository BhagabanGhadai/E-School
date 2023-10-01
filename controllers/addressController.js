const addressModel = require('../models/addressModel')

const { isRequired, isInvalid, isValid} = require("../utils/addressValidation")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const mongoose = require('mongoose')

// //-------------------------------------------------API-1 [/add why faq]--------------------------------------------------//

const addaddress = async function (req, res) {
   
    try {
        let data = req.body
 
        let error = []
        let err1 = isRequired(data)
        if (err1)
            error.push(...err1)

            let err2 = isInvalid(data)
            if (err2)
                error.push(...err2)

        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })
      
           
       let created = await addressModel.create(data)
        res.status(201).send({ status: true, message: "address created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================================== Get address ===================================================================//
const getaddressById = async (req, res) => {
    try {
        const data = req.body.addressId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild addressId" })
        }
        //find the whyaddressId which is deleted key is false--
        let address = await addressModel.findOne({ _id: data, isDeleted: false })

        if (!address) {
            return res.status(404).send({ status: false, message: "No addresss Available!!" })
        }
        return res.status(200).send({ status: true,  message: 'Success', data: address })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get All address ===================================================================//

const getAlladdress = async function (req, res) {
    try {

        let addressPresent = await addressModel.find({isDeleted: false })
        res.status(200).send({status:true, data: addressPresent})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}



// //--------------------------------------------------------- Update address Api -------------------------------------------------------//

const updateaddress = async (req, res) => {

  const {addressId} = req.body;

    const data = {
        name:req.body.name,
        phone:req.body.phone,
        address:req.body.address,
        pincode:req.body.pincode,
        city:req.body.city,
        state:req.body.state,
        country:req.body.country,

     }
   
 const updatedData = await addressModel.findOneAndUpdate({_id:addressId}, data, {new: true});
    return res.status(201).json({ updatedData: updatedData });
}

// ------------------------------------ Delete address ----------------------------------

const deleteaddress = async function (req, res) {
    try {
        const addressId = req.body.addressId
        if (!isValidObjectId(addressId)) {
            return res.status(400).send({ status: false, msg: " invalid addressId " });
        }
        const deletedDetails = await addressModel.findOneAndUpdate(
            { _id: addressId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (!deletedDetails) {
            return res.status(404).send({ status: false, message: 'addressId does not exist' })
        }
        return res.status(200).send({ status: true, message: 'address deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports = {addaddress,getaddressById,getAlladdress,updateaddress,deleteaddress}