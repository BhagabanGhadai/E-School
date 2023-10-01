const examQuestionModel = require('../models/examQuestionModel')
const exam_answerModel = require('../models/exam_answerModel')

const { isRequired, isInvalid, isValid} = require("../utils/examAnswerValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


// //-------------------------------------------------API-1 [/Add exam answer]--------------------------------------------------//

const examAnsAdd = async function (req, res) {
    try {
        let examQuesId = req.body.examQuesId;
        let exam_answer1 = req.body.exam_answer1;
        let exam_answer2 = req.body.exam_answer2;
        let exam_answer3 = req.body.exam_answer3;
        let exam_answer4 = req.body.exam_answer4;

        let isCorrect1 = req.body.isCorrect1;
        let isCorrect2 = req.body.isCorrect2;
        let isCorrect3 = req.body.isCorrect3;
        let isCorrect4 = req.body.isCorrect4;

        let data1 = {
            examQuesId,
            exam_answer: exam_answer1,
            isCorrect: isCorrect1
        }
        let data2 = {
            examQuesId,
            exam_answer: exam_answer2,
            isCorrect: isCorrect2
        }
        let data3 = {
            examQuesId,
            exam_answer: exam_answer3,
            isCorrect: isCorrect3
        }
        let data4 = {
            examQuesId,
            exam_answer: exam_answer4,
            isCorrect: isCorrect4
        }

        if (!isValidObjectId(examQuesId)) {
            return res.status(400).send({ status: false, message: "Please enter a valid examQuesId." })
        }

        let check = await examQuestionModel.findOne({ _id: examQuesId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "exam doesn't exist." })
        }

        if (exam_answer1 === undefined || exam_answer2 === undefined || exam_answer3 === undefined || exam_answer4 === undefined) {
            return res.status(400).send({ status: false, message: "Please provide all exam answers." })
        }

      

        let created1 = await exam_answerModel.create(data1);
        let created2 = await exam_answerModel.create(data2);
        let created3 = await exam_answerModel.create(data3);
        let created4 = await exam_answerModel.create(data4);

        let createdData = [created1, created2, created3, created4];
        res.status(201).send({ status: true, message: "exam answer created successfully", data: createdData });
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get exam Question ===================================================================//
const getexamAnsById = async (req, res) => {
    try {
        const data = req.body.examAnsId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild exam Answer Id" })
        }
        //find the examAnsId which is deleted key is false--
        let examAns = await exam_answerModel.findOne({ _id: data, isDeleted: false })

        if (!examAns) {
            return res.status(404).send({ status: false, message: "No exam Ans Available!!" })
        }
        return res.status(200).send({ status: true, count: examAns.length, message: 'Success', data:examAns })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//======================================================getExamQuestionById===================================================================//

const getExamQuestionById = async function (req, res) {
    try {
        const data = req.body.examQuesId;
        const pageno = req.body.pageno;
        const newpageno = pageno-1;
        const pCount = 10;
        const ispage = req.body.isPagination ;
        let examAnswer = []; 
  
        if(ispage == 1){
            examAnswer = await exam_answerModel.find({isDeleted: false,examQuesId:data }).skip(newpageno * pCount)
            .limit(pCount);
            
        } else {
            examAnswer =await exam_answerModel.find({isDeleted: false,examQuesId:data }).skip(newpageno * pCount)
            .limit(pCount);
        }
        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild  examQuesId" })
        }

        

        let PresentAll = await exam_answerModel.find({isDeleted: false,examQuesId:data });
        let exam_answer_count = Math.ceil(PresentAll.length/pCount);

       return res.status(200).send({status:true, data: examAnswer, exam_answer_count})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
//====================================================== Get all exam answer ===================================================================//

const getAllExamAnswer = async function (req, res) {
    try {
       
        let Present = await exam_answerModel.find({isDeleted: false })
        res.status(200).send({status:true, data: Present})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
// //--------------------------------------------------------- Update exam Question -------------------------------------------------------//

const updateExamAns = async function (req, res) {
    try {

      
        const { ExamAnsId} = req.body;
    
        const data = {
            exam_answer:req.body.exam_answer,
            isCorrect:req.body.isCorrect,
        }
      
    const updatedData = await exam_answerModel.findOneAndUpdate({ _id:ExamAnsId},[{ $addFields: data }],{ new: true });
     
   
    return res.status(201).json({ data:updatedData })

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}

//------------------------------------ Delete exam Question ----------------------------------


   const deleteExamAns = async (req, res) => {

    try {
      let id = req.body.ExamAnsId
  
  
  //check wheather objectId is valid or not--
      if (!isValidObjectId(id)) {
  
        return res.status(400).send({ status: false, message: "please enter valid exam Anstion id" })
      }
  
      const findExamAns = await exam_answerModel.findOne({ _id:id, isDeleted: false })
  
  
      if (!findExamAns) {
        return res.status(404).send({ status: false, message: 'No exam Ans found' })
      }
  
      await exam_answerModel.findOneAndUpdate({ _id: id },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true })
      return res.status(200).send({ status: true, message: "exam Answer deleted sucessfully" })
    }
    catch (err) {
      console.log(err.message)
      return res.status(500).send({ status: "error", msg: err.message })
    }
  }

module.exports = {examAnsAdd,getexamAnsById,getAllExamAnswer,getExamQuestionById,updateExamAns,deleteExamAns}