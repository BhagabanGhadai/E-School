const examModel = require('../models/examModel')


const { isRequired,  isValid} = require("../utils/examValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


// //------------------------------------------------- API-1 [/Add Exam] --------------------------------------------------//

const addExam= async function (req, res) {
   
    try {
        let data = req.body
      
        let error = []
        let err1 = isRequired(data)
        if (err1)
            error.push(...err1)


        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

              data.exam_slug= slugify(req.body.exam_name);
      
        let created = await examModel.create(data)
        res.status(201).send({ status: true, message: "Exam created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//======================================================Get Exam===================================================================//
const getExamById = async (req, res) => {
    try {
        const data = req.body.examId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild exam Id" })
        }
        //find the examId which is deleted key is false--
        let exam = await examModel.findOne({isDeleted: false,_id: data})

        if (!exam) {
            return res.status(404).send({ status: false, message: "No exam Available!!" })
        }
        return res.status(200).send({ status: true, message: 'Success', data:exam })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//======================================================Get All Exam===================================================================//

const getAllExam = async function (req, res) {
    try {
        const pageno = req.body.pageno;
        const newpageno = pageno-1;
        let pCount = 10;
        let exam = []; 
    const ispage = req.body.isPagination ;


    if(ispage == 1){
        exam = await examModel
        .find({ isDeleted: false })
        .skip(newpageno * pCount)
        .limit(pCount); 
    } else {
        exam = await examModel
        .find({ isDeleted: false })
        .skip(newpageno * pCount)
        .limit(pCount);
    }
      
          
        let examAll = await examModel
          .find({ isDeleted: false });

        let exam_count = Math.ceil(examAll.length/pCount);

        res.status(200).send({status:true, data: exam, exam_count})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


// //---------------------------------------------------------Update Exam-------------------------------------------------------//


const updateExam = async function (req, res) {
    try {

       const { examId} = req.body;
    
        const data = {
            
            exam_name:req.body.exam_name,
            correct_mark:req.body.correct_mark,

            incorrect_mark:req.body.incorrect_mark,

            description:req.body.description,

            exam_slug:`${slugify(req.body.exam_name)}`,
        }
      
    
        const updatedData = await examModel.findOneAndUpdate({ _id:examId}, data, { new: true });
        return res.status(201).json({ updatedData:updatedData });

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}

//------------------------------------Delete Exam----------------------------------


const deleteExam = async (req, res) => {
    try {
        const examId = req.body.examId;

        if (!isValidObjectId(examId)) {
            return res.status(400).send({ status: false, message: "Please enter a valid exam ID" });
        }

        const exam = await examModel.findOne({ _id: examId, isDeleted: false });

        if (!exam) {
            return res.status(404).send({ status: false, message: "No exam found" });
        }

        const achieverCount = await achieversModel.countDocuments({ exam: examId, isDeleted: false });

        if (achieverCount > 0) {
            return res.status(400).send({ status: false, message: "Please first Delete achievers" });
        }

        await examModel.findOneAndUpdate({ _id: examId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });

        return res.status(200).send({ status: true, message: "Exam deleted successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ status: "error", msg: err.message });
    }
};


module.exports = {addExam,getExamById,getAllExam,updateExam,deleteExam}