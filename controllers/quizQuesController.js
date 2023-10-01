const quizQuesModel = require('../models/quizQuesModel')
const quizModel = require('../models/quizModel')
const quizAnsModel = require('../models/quizAnsModel')
const quizResultModel = require('../models/quizResultModel')
const cloudinary = require("../utils/cloudinary");


const { isRequired, isInvalid, isValid} = require("../utils/quizQuesValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


// //------------------------------------------------- API-1 [/Add Quiz Question] --------------------------------------------------//

const quizQuesAdd = async function (req, res) {
  try {
      let data = req.body
      let quizId = req.body.quizId

      if (!isValidObjectId(quizId)) {
          return res.status(400).send({ status: false, message: "Please enter a valid quizId" })
      }

      let check = await quizModel.findOne({ _id: quizId, isDeleted: false }).lean()
      if (!check) {
          return res.status(404).send({ status: false, message: "Quiz doesn't exist" })
      }

      let error = []
      let err1 = isRequired(data)
      if (err1)
          error.push(...err1)

      if (error.length > 0)
          return res.status(400).send({ status: false, message: error })

      data.quiz_question_slug = slugify(req.body.quiz_question);

      // Check if the questionImage field exists in the request
      if (req.file && req.file.path) {
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "mankantlaweducation/questionImage",
          });
          data.questionImage = result.secure_url;
      }

      let created = await quizQuesModel.create(data)
      res.status(201).send({ status: true, message: "Quiz Question created successfully", data: created })
  } catch (error) {
      res.status(500).send({ status: false, message: error.message })
  }
}


//======================================================Get Quiz Question===================================================================//
const getquizQuesById = async (req, res) => {
    try {
        const data = req.body.quizQuesId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild quiz Ques Id" })
        }
        //find the quizQuesId which is deleted key is false--
        let quizQues = await quizQuesModel.findOne({isDeleted: false,_id: data})

        if (!quizQues) {
            return res.status(404).send({ status: false, message: "No quiz Ques Available!!" })
        }
        return res.status(200).send({ status: true, message: 'Success', data:quizQues })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}
//======================================================Get Quiz Question by quiz Id===================================================================//


const getquizById = async (req, res) => {
  try {
    const quizId = req.body.quizId.toString();

    if (!isValidObjectId(quizId)) {
      return res.status(400).send({
        status: false,
        message: "Please enter a valid quiz Id",
      });
    }

    let quizExists = await quizModel.findOne({
      _id: quizId,
      isDeleted: false,
    });

    if (!quizExists) {
      return res.status(404).send({
        status: false,
        message: "Quiz does not exist",
      });
    }

    let questions = await quizQuesModel
      .find({ quizId: quizId, isDeleted: false })
      .select({ quiz_question: 1,questionImage:1 })
      .lean();

    for (let question of questions) {
      const answers = await quizAnsModel
        .find({ quizQuesId: question._id, isDeleted: false })
        .select({ quiz_answer: 1, isCorrect: 1 })
        .lean();
      question.answers = answers;
    }
    if (!questions) {
      return res.status(404).send({
        status: false,
        message: "Quiz Answer do not exist",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Success",
      questions: questions,
    });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};


//======================================================Get All Quiz Question===================================================================//

const getAllQuizQues = async function (req, res) {
  try {
    const data = req.body.quizId;
    const pageno = req.body.pageno;
    const newpageno = pageno-1;
    const pCount = 10;
    const ispage = req.body.isPagination ;

    let quizQues = []; 

    if(ispage == 1){
        quizQues =  await quizQuesModel
        .find({ isDeleted: false, quizId: data })
        .skip(newpageno * pCount)
        .limit(pCount);
    } else {
        quizQues =  await quizQuesModel
        .find({ isDeleted: false, quizId: data });
    }

    if (!isValidObjectId(data)) {
        return res.status(400).send({ status: false, message: "Invaild quizId" })
    }
   
    

    let quizQuesAll = await quizQuesModel
      .find({ isDeleted: false, quizId: data });
    let quizQues_count = Math.ceil(quizQuesAll.length/pCount);

    res.status(200).send({status:true, data: quizQues, quizQues_count,isPagination:1})
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};




//====================================================== Get By quiz slug===================================================================//
const getByQuizSlug = async (req, res) => {
  try {
    const quiz_slug = req.body.quiz_slug;

    let quizExists = await quizModel.findOne({
      quiz_slug: quiz_slug,
      isDeleted: false,
    }).select({quiz_title: 1, correct_mark: 1, incorrect_mark: 1, duration: 1, note: 1});

    if (!quizExists) {
      return res.status(404).send({
        status: false,
        message: "Quiz does not exist",
      });
    }

    let questions = await quizQuesModel
      .find({ quizId: quizExists._id, isDeleted: false })
      .select({ quiz_question: 1, questionImage: 1 })
      .lean();

    for (let question of questions) {
      const answers = await quizAnsModel
        .find({ quizQuesId: question._id, isDeleted: false })
        .select({ quiz_answer: 1, isCorrect: 1 })
        .lean();
      question.answers = answers;

      if ('questionImage' in question) {
        question.isImage = 1;
        question.questionImage = question.questionImage;
      } else {
        question.isImage = 0;
        question.questionImage = "";
      }

     
    }

    if (!questions) {
      return res.status(404).send({
        status: false,
        message: "Quiz answers do not exist",
      });
    }
    

    return res.status(200).send({
      status: true,
      message: "Success",
      questionImage: questions.questionImage, 
      totalQuestion: questions.length,
      quizDetail: quizExists,
      noAnswer: 0,
      questions: questions
    });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};






//====================================================== get Result By Quiz Slug===================================================================//

const getResultByQuizSlug = async (req, res) => {
  try {
    const quiz_slug = req.body.quiz_slug;
    const userId = req.body.userId;
    let quizExists = await quizModel.findOne({
      quiz_slug: quiz_slug,
      isDeleted: false,
    });

    if (!quizExists) {
      return res.status(404).send({
        status: false,
        message: "Quiz Does Not Exist",
      });
    }

    let questions = await quizQuesModel
      .find({ quizId: quizExists._id, isDeleted: false })
      .select({ _id: 1, quiz_question: 1 })
      .lean();

    for (let question of questions) {
      const answers = await quizAnsModel
        .find({ quizQuesId: question._id, isDeleted: false })
        .select({ _id: 1, quiz_answer: 1, isCorrect: 1 })
        .lean();

      question.answers = [];

      for (let answer of answers) {
        answer.isSubmit = 0;

        const userAnswer = await quizResultModel.findOne({
          userId: userId,
          'answer.quizQuesId': question._id.toString(),
          'answer.answerId': answer._id.toString(),
        });

        if (userAnswer) {
          answer.isSubmit = 1;
        }

        answer.answerId = answer._id.toString();
        delete answer._id;

        question.answers.push(answer);
      }
    }

    return res.status(200).send({
      status: true,
      message: "Success",
      questions: questions,
    });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};


// //---------------------------------------------------------Update Quiz Question-------------------------------------------------------//


const updateQuizQues = async function (req, res) {
    try {

       const { quizQues_id} = req.body;
    
        const data = {
            quiz_question:req.body.quiz_question,
            quiz_question_slug:`${slugify(req.body.quiz_question)}`,
        }
      
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, { folder:'mankantlaweducation/questionImage' });
          data.questionImage= result.secure_url;
      }
        const updatedData = await quizQuesModel.findOneAndUpdate({ _id:quizQues_id}, data, { new: true });
        return res.status(201).json({ updatedData:updatedData });

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}

//------------------------------------Delete Quiz Question----------------------------------


const deleteQuizQues = async (req, res) => {
  try {
    const quizQuesId = req.body.quizQuesId;

    if (!isValidObjectId(quizQuesId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid quiz question ID" });
    }

    const quizQuesCount = await quizAnsModel.countDocuments({
      quizQuesId: quizQuesId,
      isDeleted: false,
    });

    if (quizQuesCount > 0) {
      return res.status(400).send({
        status: false,
        message: "Please first delete the associated quiz answers",
      });
    }

    const quizQues = await quizQuesModel.findOneAndUpdate(
      { _id: quizQuesId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );

    if (!quizQues) {
      return res
        .status(404)
        .send({ status: false, message: "No quiz question found" });
    }

    return res
      .status(200)
      .send({ status: true, message: "Quiz question deleted successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "error", msg: err.message });
  }
};


module.exports = {quizQuesAdd,getquizQuesById,getquizById,getAllQuizQues,getByQuizSlug,getResultByQuizSlug,updateQuizQues,deleteQuizQues}