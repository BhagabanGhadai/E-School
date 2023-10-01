const quizModel = require('../models/quizModel')
const quizQuesModel = require('../models/quizQuesModel')

const quizResultModel = require('../models/quizResultModel')

const cloudinary = require("../utils/cloudinary");
const chapterModel = require('../models/chapterModel')

const { isRequired, isInvalid, isValid } = require("../utils/quizValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


// //-------------------------------------------------API-1 [/Add Quiz]--------------------------------------------------//

const quizAdd = async function (req, res) {
    try {
      let data = req.body;
      let image = req.image;
      let chapterId = req.body.chapterId;
  
      if (!isValidObjectId(chapterId)) {
        return res.status(400).send({ status: false, message: "plz enter valid chapterId" });
      }
  
      let check = await chapterModel.findOne({ _id: chapterId, isDeleted: false }).lean();
      if (!check) {
        return res.status(404).send({ status: false, message: "chapter does not exist" });
      }
  
      let error = [];
      let err1 = isRequired(data, image);
      if (err1) error.push(...err1);
  
      let err2 = isInvalid(data, image);
      if (err2) error.push(...err2);
  
      if (error.length > 0) return res.status(400).send({ status: false, message: error });
  
      if (!req.file || !req.file.path) {
        return res.status(400).send({ status: false, message: "No file uploaded" });
      }
  
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mankantlaweducation/addquiz",
      });
      data.image = result.secure_url;
      data.quiz_slug = slugify(req.body.quiz_title);
  
      let created = await quizModel.create(data);
      res.status(201).send({ status: true, message: "quiz created successfully", data: created });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };
  

//====================================================== Get Quiz ===================================================================//
const getquizById = async (req, res) => {
    try {
        const data = req.body.quizId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild quiz Id" })
        }
        //find the quizId which is deleted key is false--
        let quiz = await quizModel.findOne({ _id: data, isDeleted: false })

        if (!quiz) {
            return res.status(404).send({ status: false, message: "No quizs Available!!" })
        }
        return res.status(200).send({ status: true,  message: 'Success', data: quiz })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get All Quiz ===================================================================//

const getAllQuiz = async function (req, res) {
    try {
      const data = req.body.chapterId;
      const pageno = req.body.pageno;
      const newpageno = pageno-1;
      const pCount = 10;
      const ispage = req.body.isPagination ;

      let quiz = []; 
  
      if(ispage == 1){
        quiz =  await quizModel
        .find({ isDeleted: false, chapterId: data })
        .skip(newpageno * pCount)
        .limit(pCount);

      } else {
        quiz =  await quizModel
        .find({ isDeleted: false, chapterId: data })
        .skip(newpageno * pCount)
        .limit(pCount);

      }
  
      if (!isValidObjectId(data)) {
        return res.status(400).send({ status: false, message: "Invalid chapterId" });
      }
  
      const quizAll = await quizModel
        .find({ isDeleted: false, chapterId: data });
      
      const quiz_count = quizAll.length;
      const quizCount = Math.ceil(quiz.length/pCount);
  
      res.status(200).send({ status: true, data: { quizzes: quiz, number_Of_Question: quizCount, quiz_count } });
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  };

//====================================================== Get By Chapter Slug===================================================================//


const getByChapterSlug = async function (req, res) {
  try {
    const chapter_slug = req.body.chapter_slug;
    const userId = req.body.userId;
   

    const chapter = await chapterModel.findOne({ chapter_slug: chapter_slug });

    if (!chapter) {
      return res.status(404).send({ status: false, message: "No chapters Available!!" });
    }

    const quizzes = await quizModel.find({ chapterId: chapter._id });
    const quizCount = quizzes.length;

    let newQuizs = [];
    for(let i = 0; i<quizzes.length; i++){
      let quizId = quizzes[i]._id.toString();

      let isAttempted;

      const isResult = await quizResultModel.findOne({ userId: userId, quizId: quizId, isDeleted: false });
      if(isResult!=null){
        isAttempted = 1;
      }else{
        isAttempted = 0;
      }
      newQuizs.push({"_id" : quizzes[i]._id.toString(), "quiz_title" : quizzes[i].quiz_title, "quiz_slug" : quizzes[i].quiz_slug, "correct_mark" : quizzes[i].correct_mark, "incorrect_mark" : quizzes[i].incorrect_mark, "short_description" : quizzes[i].short_description, "image" : quizzes[i].image, "chapterId" : quizzes[i].chapterId, "isAttempted" : isAttempted})
    }

    res.status(200).send({
      status: true,
      data: newQuizs,
      number_Of_Question: quizCount,
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};




// //--------------------------------------------------------- Update Quiz Api -------------------------------------------------------//
//-------------------------------------Update Quiz----------------------------------------
const updateQuiz = async (req, res) => {

  const {quiz_id} = req.body;

    const data = {
        quiz_title:req.body.quiz_title,
        correct_mark:req.body.correct_mark,
        incorrect_mark:req.body.incorrect_mark,
        duration:req.body.duration,
        note:req.body.note,
        short_description:req.body.short_description,
        quiz_slug:`${slugify(req.body.quiz_title)}`,
     }
   
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder:'mankantlaweducation/addquiz' });
        data.image= result.secure_url;
    }
    const updatedData = await quizModel.findOneAndUpdate({_id:quiz_id}, data, {new: true});
    return res.status(201).json({ updatedData: updatedData });
}

// ------------------------------------ Delete Quiz ----------------------------------

const deleteQuiz = async function (req, res) {
  try {
      const quizId = req.body.quizId
      if (!isValidObjectId(quizId)) {
          return res.status(400).send({ status: false, msg: " invalid quizId " });
      }

      const quizQuestionCount = await quizQuesModel.countDocuments({ quizId: quizId });
      if (quizQuestionCount > 0) {
          return res.status(400).send({ status: false, message: "Please first delete the quiz questions" });
      }

      const deletedDetails = await quizModel.findOneAndUpdate(
          { _id: quizId, isDeleted: false },
          { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

      if (!deletedDetails) {
          return res.status(404).send({ status: false, message: 'quiz does not exist' })
      }
      return res.status(200).send({ status: true, message: 'quiz deleted successfully.' })
  }
  catch (err) {
      res.status(500).send({ status: false, message: err.message })
  }
}



module.exports = {quizAdd,getquizById,getAllQuiz,getByChapterSlug,updateQuiz,deleteQuiz}