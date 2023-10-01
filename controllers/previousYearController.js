const previousYearModel = require('../models/previousYearModel')
const previousYearQuestionModel = require('../models/previousYearQuesionModel')


const { isRequired,  isValid,isInvalid} = require("../utils/previousYearValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')
const cloudinary = require("../utils/cloudinary");

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


// //------------------------------------------------- API-1 [/Add previousYear] --------------------------------------------------//

const addpreviousYear = async function (req, res) {
    try {
      let data = req.body
      let image = req.file 
  
      let error = []
      let err1 = isRequired(data, image)
      if (err1)
        error.push(...err1)
  
      let err2 = isInvalid(data, image)
      if (err2)
        error.push(...err2)
  
      if (error.length > 0)
        return res.status(400).send({ status: false, message: error })
  
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "mankantlaweducation/previousQuestion",
      });
      data.image = result.secure_url;
      data.title_slug= slugify(req.body.title);
      let created = await previousYearModel.create(data)
      res.status(201).send({ status: true, message: "previousYear created successfully", data: created })
    } catch (error) {
      res.status(500).send({ status: false, message: error.message })
    }
  }
  

//======================================================Get previousYear===================================================================//
const getpreviousYearById = async (req, res) => {
    try {
        const data = req.body.previousYearId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild previousYear Id" })
        }
        //find the previousYearId which is deleted key is false--
        let previousYear = await previousYearModel.findOne({isDeleted: false,_id: data})

        if (!previousYear) {
            return res.status(404).send({ status: false, message: "No previousYear Available!!" })
        }
        return res.status(200).send({ status: true, message: 'Success', data:previousYear })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//======================================================Get All previousYear===================================================================//

const getAllpreviousYear = async function (req, res) {
    try {
        let getAllprevious = await previousYearModel.find({ isDeleted: false }).select({"title":1,"title_slug":1,"description":1,"image":1});
        let newData = [];
        for(let i = 0; i<getAllprevious.length; i++){
            let previousYear = await previousYearQuestionModel.find({ previousYearId: getAllprevious[i]._id, isDeleted: false }).select({"title":1,"pdf":1});
            let totalQus=previousYear.length;
            let preFirst = previousYear.slice(0,3);
            let preLast = previousYear.slice(3,totalQus);

            newData.push({_id: getAllprevious[i]._id, title: getAllprevious[i].title, title_slug: getAllprevious[i].title_slug, description: getAllprevious[i].description, image: getAllprevious[i].image, previousYearQuestions: preFirst, previousYearQuestionsLast: preLast});
        }
        res.status(200).send({ status: true, data: newData });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}



// //---------------------------------------------------------Update previousYear-------------------------------------------------------//


const updatepreviousYear = async function (req, res) {
    try {
        
       const { previousYearId} = req.body;

        const data = {
            title:req.body.title,
            description:req.body.description,

            title_slug: `${slugify(req.body.title)}`,
        }
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'mankantlaweducation/previousQuestion' });

            data.image = result.secure_url;
    
        }
    
      
    
        const updatedData = await previousYearModel.findOneAndUpdate({ _id:previousYearId}, data, { new: true });
        return res.status(201).json({ updatedData:updatedData });

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}

//------------------------------------Delete previousYear----------------------------------


const deletepreviousYear = async (req, res) => {
    try {
        const previousYearId = req.body.previousYearId;

        if (!isValidObjectId(previousYearId)) {
            return res.status(400).send({ status: false, message: "Please enter a valid previousYear ID" });
        }

        const previousYear = await previousYearModel.findOne({ _id: previousYearId, isDeleted: false });

        if (!previousYear) {
            return res.status(404).send({ status: false, message: "No previousYear found" });
        }

        await previousYearModel.findOneAndUpdate({ _id: previousYearId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });

        return res.status(200).send({ status: true, message: "previousYear deleted successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ status: "error", msg: err.message });
    }
};


module.exports = {addpreviousYear,getpreviousYearById,getAllpreviousYear,updatepreviousYear,deletepreviousYear}