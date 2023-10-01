const quizQuesModel = require('../models/quizQuesModel')
const quizAnsModel = require('../models/quizAnsModel')

const { isRequired, isInvalid, isValid} = require("../utils/quizAnsValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


// //-------------------------------------------------API-1 [/Add Quiz answer]--------------------------------------------------//



const quizAnsAdd = async function (req, res) {
    try {
        let quizQuesId = req.body.quizQuesId;
        let quiz_answer1 = req.body.quiz_answer1;
        let quiz_answer2 = req.body.quiz_answer2;
        let quiz_answer3 = req.body.quiz_answer3;
        let quiz_answer4 = req.body.quiz_answer4;

        let isCorrect1 = req.body.isCorrect1;
        let isCorrect2 = req.body.isCorrect2;
        let isCorrect3 = req.body.isCorrect3;
        let isCorrect4 = req.body.isCorrect4;

        let data1 = {
            quizQuesId,
            quiz_answer: quiz_answer1,
            quiz_answer_slug: '',
            isCorrect: isCorrect1
        }
        let data2 = {
            quizQuesId,
            quiz_answer: quiz_answer2,
            quiz_answer_slug: '',
            isCorrect: isCorrect2
        }
        let data3 = {
            quizQuesId,
            quiz_answer: quiz_answer3,
            quiz_answer_slug: '',
            isCorrect: isCorrect3
        }
        let data4 = {
            quizQuesId,
            quiz_answer: quiz_answer4,
            quiz_answer_slug: '',
            isCorrect: isCorrect4
        }

        if (!isValidObjectId(quizQuesId)) {
            return res.status(400).send({ status: false, message: "Please enter a valid quizQuesId." })
        }

        let check = await quizQuesModel.findOne({ _id: quizQuesId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "Quiz doesn't exist." })
        }

        if (quiz_answer1 === undefined || quiz_answer2 === undefined || quiz_answer3 === undefined || quiz_answer4 === undefined) {
            return res.status(400).send({ status: false, message: "Please provide all quiz answers." })
        }

        data1.quiz_answer_slug = slugify(data1.quiz_answer);
        data2.quiz_answer_slug = slugify(data2.quiz_answer);
        data3.quiz_answer_slug = slugify(data3.quiz_answer);
        data4.quiz_answer_slug = slugify(data4.quiz_answer);

        let created1 = await quizAnsModel.create(data1);
        let created2 = await quizAnsModel.create(data2);
        let created3 = await quizAnsModel.create(data3);
        let created4 = await quizAnsModel.create(data4);

        let createdData = [created1, created2, created3, created4];
        res.status(201).send({ status: true, message: "Quiz answer created successfully", data: createdData });
    } catch (error) {
        if (error.message === 'slugify: string argument expected') {
            return res.status(400).send({ status: false, message: "Please provide valid quiz answers." });
        }
        res.status(500).send({ status: false, message: error.message });
    }
}



 
//====================================================== Get Quiz Question ===================================================================//
const getquizAnsById = async (req, res) => {
    try {
        const data = req.body.quizAnsId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild quiz Answer Id" })
        }
        //find the quizAnsId which is deleted key is false--
        let quizAns = await quizAnsModel.findOne({ _id: data, isDeleted: false })

        if (!quizAns) {
            return res.status(404).send({ status: false, message: "No quiz Ans Available!!" })
        }
        return res.status(200).send({ status: true, count: quizAns.length, message: 'Success', data:quizAns })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get All Quiz Answer ===================================================================//

const getAllQuizAns = async function (req, res) {
    try {
        const data = req.body.quizQuesId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild  quizQuesId" })
        }

        let quizQuesPresent = await quizAnsModel.find({isDeleted: false,quizQuesId:data })
       return res.status(200).send({status:true, data: quizQuesPresent})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

// //--------------------------------------------------------- Update Quiz Question -------------------------------------------------------//

const updateQuizAns = async function (req, res) {
    try {

      
        const { quizAns_id} = req.body;
    
        const data = {
            quiz_answer:req.body.quiz_answer,
            isCorrect:req.body.isCorrect,

            quiz_answer_slug: `${slugify(req.body.quiz_answer)}`,
        }
      
    const updatedData = await quizAnsModel.findOneAndUpdate({ _id:quizAns_id},[{ $addFields: data }],{ new: true });
     
   
    return res.status(201).json({ data:updatedData })

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}

//------------------------------------ Delete Quiz Question ----------------------------------


   const deleteQuizAns = async (req, res) => {

    try {
      let id = req.body.quizAnsId
  
  
  //check wheather objectId is valid or not--
      if (!isValidObjectId(id)) {
  
        return res.status(400).send({ status: false, message: "please enter valid quiz Anstion id" })
      }
  
      const findquizAns = await quizAnsModel.findOne({ _id:id, isDeleted: false })
  
  
      if (!findquizAns) {
        return res.status(404).send({ status: false, message: 'No quiz Ans found' })
      }
  
      await quizAnsModel.findOneAndUpdate({ _id: id },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true })
      return res.status(200).send({ status: true, message: "Quiz Answer deleted sucessfully" })
    }
    catch (err) {
      console.log(err.message)
      return res.status(500).send({ status: "error", msg: err.message })
    }
  }

module.exports = {quizAnsAdd,getquizAnsById,getAllQuizAns,updateQuizAns,deleteQuizAns}