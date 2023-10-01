const previousYearQuestionModel = require('../models/previousYearQuesionModel')
const previousYearModel = require('../models/previousYearModel')





const cloudinary = require("../utils/cloudinary");
const { isRequired, isInvalid, isValid} = require("../utils/previousYearQuestionValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



// //------------------------------------------------- API-1 [/Add previousYear] --------------------------------------------------//

const previousYearQuestionAdd= async function (req, res) {
   
    try {
        let data = req.body
        let previousYearId = req.body.previousYearId
        let pdf= req.pdf

        if (!isValidObjectId(previousYearId)) {
            return res.status(400).send({ status: false, message: "plz enter valid previousYearId" })
        }


        let check = await previousYearModel.findOne({ _id:previousYearId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "previousYear does'nt exist" })
        }
      
        let error = []
        let err1 = isRequired(data, pdf)
        if (err1)
            error.push(...err1)

        let err2 = isInvalid(data, pdf)
        if (err2)
            error.push(...err2)

        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "mankantlaweducation/addpreviousYearQuestion",
              });
              data.pdf= result.secure_url;
              data.title_slug= slugify(req.body.title);
      
           
      

        let created = await previousYearQuestionModel.create(data)
        res.status(201).send({ status: true, message: "previousYear created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================================== Get previousYear ===================================================================//
const getpreviousYearQuestionById = async (req, res) => {
    try {
        const data = req.body.previousYearQuestionId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild previousYear Id" })
        }
        //find the previousYearId which is deleted key is false--
        let previousYear = await previousYearQuestionModel.findOne({ _id: data, isDeleted: false })

        if (!previousYear) {
            return res.status(404).send({ status: false, message: "No previousYear Available!!" })
        }
        return res.status(200).send({ status: true, count: previousYear.length, message: 'Success', data: previousYear })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get All previousYear question ===================================================================//

const getAllpreviousYearQuestion = async function (req, res) {
    try {
      const getAllpreviousYear = await previousYearQuestionModel.find({ isDeleted: false }).select({ "title": 1, "title_slug": 1, "pdf": 1, "previousYearId": 1 });
      res.status(200).send({ status: true, data: getAllpreviousYear });
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  };
  
  
  





// //--------------------------------------------------------- Update previousYear -------------------------------------------------------//


const updatepreviousYearQuestion = async (req, res) => {

  const { previousYearQuestionId } = req.body;

    const data = {
          title:req.body.title,
          title_slug: `${slugify(req.body.title)}`,
    }
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'mankantlaweducation/addpreviousYearQuestion' });
        data.pdf = result.secure_url;

    }
    
    const updatedData = await previousYearQuestionModel.findOneAndUpdate({ _id: previousYearQuestionId }, data, { new: true });
    return res.status(201).json({ updatedData:updatedData });
}
//------------------------------------ Delete previousYear ----------------------------------

const deletepreviousYearQuestion= async (req, res) => {

    try {
      let id = req.body.previousYearQuestionId
  
  
  //check wheather objectId is valid or not--
      if (!isValidObjectId(id)) {
  
        return res.status(400).send({ status: false, message: "please enter valid id" })
      }
  
      const findpreviousYear = await previousYearQuestionModel.findOne({ _id: id, isDeleted: false })
  
  
      if (!findpreviousYear) {
        return res.status(404).send({ status: false, message: 'No previousYear found' })
      }
  
      await previousYearQuestionModel.findOneAndUpdate({ _id: id },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true })
      return res.status(200).send({ status: true, message: "deleted sucessfully" })
    }
    catch (err) {
      console.log(err.message)
      return res.status(500).send({ status: "error", msg: err.message })
    }
  }

  module.exports = {previousYearQuestionAdd,getpreviousYearQuestionById,getAllpreviousYearQuestion,updatepreviousYearQuestion,deletepreviousYearQuestion}
