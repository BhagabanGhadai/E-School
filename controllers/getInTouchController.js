const getInTouchModel = require("../models/getInTouchModel");
const nodemailer = require("nodemailer");
const {isRequired } = require("../utils/getInTouchValidation")

const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId)
}


//------------------------------------------------- API-1 [/get in touch] --------------------------------------------------//

const createGetInTouch = async function (req, res) {
  try {
    let data = req.body;
  
    let error = [];
    let err1 = isRequired(data);
    if (err1) error.push(...err1);


    if (error.length > 0)
      return res.status(400).send({ status: false, message: error });


    let created = await getInTouchModel.create(data);
    res.status(201).send({
      status: true,
      message: "getInTouchModel successfully",
      data: created,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

    // /////////////////////////  Get Touch in By Id //////////////////////////////////////////

const getTouchInById = async function (req, res) {
  try {
    const getTouchInById = req.body.getTouchInById ;
 
 
  //find the touchInById which is deleted key is false--
  let check = await getInTouchModel.findOne({ _id: getTouchInById, isDeleted: false })

  if (!check) {
      return res.status(404).send({ status: false, message: "No touchInById Available!!" })
  }
  return res.status(200).send({ status: true, message: 'Success', data: check })
  } catch (error) {
    res.status(500).send({ Error: error.message })
  }
};

//====================================================== Get All ===================================================================//

const getAll= async function (req, res) {
  try {

    const check = await getInTouchModel.find({ isDeleted: false })

    res.status(200).send({ status: true, data: check });
  } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
  }
}

// _________________________________________Update __________________________________//

const update = async function (req, res) {
    try {

        const { getTouchInById,name,email,message } = req.body;

        const data = {
            name,
            email,
            message,
        }
       
        
        const updatedData = await getInTouchModel.findOneAndUpdate({ _id: getTouchInById }, data, { new: true });
        return res.status(201).json({ updatedData: updatedData });

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}



// ------------------------------------ Delete Exam Course ----------------------------------

const deleteGetInTouch = async function (req, res) {
    try {
        const getTouchInById = req.body.getTouchInById
        if (!isValidObjectId(getTouchInById)) {
            return res.status(400).send({ status: false, msg: "getTouchInById is invalid" });
        }
        const deletedDetails = await getInTouchModel.findOneAndUpdate(
            { _id: getTouchInById, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (!deletedDetails) {
            return res.status(404).send({ status: false, message: 'exam course does not exist' })
        }
        return res.status(200).send({ status: true, message: 'exam Course deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports ={createGetInTouch,getTouchInById,getAll,update,deleteGetInTouch }