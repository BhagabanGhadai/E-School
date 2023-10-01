const quizv2Model = require('../models/quizv2Model')
const quizPageModel = require('../models/quizPageModel')

const quizQuestionV2Model = require('../models/quizQuestionV2Model')
const quizAnswerV2Model = require('../models/quizAnswerV2Model')


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
      let {quiz_title, description, max_attempt, max_mark, start, end} = req.body;

      let data = {
        quiz_title,
        description,
        max_attempt,
        max_mark,
        start,
        end
      }
      data.quiz_slug = slugify(req.body.quiz_title);
  
      let created = await quizv2Model.create(data);
    //   for(let i=0; i<10; i++){
    //     let page_data ={
    //         quizId: created._id,
    //         sequence: i+1
    //     }
    //     let pagecreated = await quizPageModel.create(page_data);
    //   }
      res.status(201).send({ status: true, message: "quiz created successfully", data: created });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };

  const addPage = async function (req, res) {
    try {
      let {quiz_id} = req.body;

      let data = {
        quizId: quiz_id,
      }
  
      let pagecreated = await quizPageModel.create(data);
      res.status(201).send({ status: true, message: "quiz page created successfully", data: pagecreated });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };
  

//====================================================== Get Quiz ===================================================================//
const getPagesById = async (req, res) => {
    try {
        const data = req.body.quizId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild quiz Id" })
        }
        //find the quizId which is deleted key is false--
        let quiz = await quizv2Model.findOne({ _id: data, isDeleted: false })

        if (!quiz) {
            return res.status(400).send({ status: false, message: "No quizs Available!!" })
        }

        let pages = await quizPageModel.find({ quizId: data, isDeleted: false }).select({sequence: 1})

        return res.status(200).send({ status: true,  message: 'Success', data: pages })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get Quiz ===================================================================//
const getquizById = async (req, res) => {
    
        const quizId = req.body.quizId

        if (!isValidObjectId(quizId)) {
            return res.status(400).send({ status: false, message: "Invaild quiz Id" })
        }
        //find the quizId which is deleted key is false--
        let quizV = await quizv2Model.findOne({ _id: quizId, isDeleted: false })

        if (!quizV) {
            return res.status(404).send({ status: false, message: "No quizs Available!!" })
        }
        let quiz = null
    let query = {}
    query["_id"] = new mongoose.Types.ObjectId(quizId)

    try {
      quiz = await quizv2Model.aggregate([
        {
            $match: query
        },
        {
            $project: {
                createdAt: 0,
                updatedAt: 0,
                status: 0,
                isDeleted: 0
            }
        },
        {
            $lookup: {
                from: "quizpages",
                let: {
                    "quizId": "$_id"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$quizId", "$$quizId"]
                            }
                        }
                    },
                    {
                        $project: {
                            createdAt: 0,
                            updatedAt: 0,
                            status: 0,
                            isDeleted: 0
                        }
                    },
                    {
                        $lookup: {
                            from: "quizquestionv2",
                            let: {
                                "page_id": "$_id"
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$quizPageId", "$$page_id"]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        createdAt: 0,
                                        updatedAt: 0,
                                        status: 0,
                                        isDeleted: 0
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "quizanswerv2",
                                        let: {
                                            "question_id": "$_id"
                                        },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $eq: ["$quizQuestionId", "$$question_id"]
                                                    }
                                                }
                                            },
                                            {
                                                $project: {
                                                    createdAt: 0,
                                                    updatedAt: 0,
                                                    status: 0,
                                                    isDeleted: 0
                                                }
                                            }
                                        ],
                                        as: "answers"
                                    }
                                },
                            ],
                            as: "questions"
                        }
                    }
                ],
                as: "pages"
            }
        }
    ]).exec()
    } catch (error) {
        res.status(500).send({ Error: error.message })
    }
    if (!quiz.length) {
        return res.status(400).send({ status: false, message: "No quizs Available!!" })
    }
    return res.status(200).json(quiz)
    
}

//====================================================== Get All Quiz ===================================================================//

const getAllQuiz = async function (req, res) {
    try {
  
      const quizAll = await quizv2Model
        .find({ isDeleted: false });
  
      res.status(200).send({ status: true, data: quizAll});
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

    const quizzes = await quizv2Model.find({ chapterId: chapter._id });
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
    const updatedData = await quizv2Model.findOneAndUpdate({_id:quiz_id}, data, {new: true});
    return res.status(201).json({ updatedData: updatedData });
}

// ------------------------------------ Delete Quiz ----------------------------------

const deleteQuiz = async function (req, res) {
  try {
      const quizId = req.body.quizId
      if (!isValidObjectId(quizId)) {
          return res.status(400).send({ status: false, msg: " invalid quizId " });
      }

      const quizQuestionCount = await quizQuestionV2Model.countDocuments({ quizId: quizId });
      if (quizQuestionCount > 0) {
          return res.status(400).send({ status: false, message: "Please first delete the quiz questions" });
      }

      const deletedDetails = await quizv2Model.findOneAndUpdate(
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

const deleteQuestionByPageId = async function (req, res) {
    try {
        const quizPageId = req.body.quizPageId
        if (!isValidObjectId(quizPageId)) {
            return res.status(400).send({ status: false, msg: " invalid quizPageId " });
        }
  
  
        const deletedDetails = await quizQuestionV2Model.deleteMany(
            { quizPageId: quizPageId },
            );
  
        if (!deletedDetails) {
            return res.status(404).send({ status: false, message: 'quiz does not exist' })
        }
        return res.status(200).send({ status: true, message: 'quiz deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
  }



module.exports = {quizAdd,addPage,getquizById,getPagesById,getAllQuiz,getByChapterSlug,updateQuiz,deleteQuiz,deleteQuestionByPageId}