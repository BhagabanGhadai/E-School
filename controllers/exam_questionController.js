const examQuestionModel = require("../models/examQuestionModel");
const exam_courseModel = require("../models/exam_CourseModel");
const examCourseModel = require("../models/exam_CourseModel");
const examAnsModel = require("../models/exam_answerModel");
const examResultModel = require("../models/examResultModel");
const examQuesModel = require("../models/examQuestionModel");



const cloudinary = require("../utils/cloudinary");
const {
  isRequired,
  isInvalid,
  isValid,
} = require("../utils/examQuestionValidation");
const slugify = require("slugify");
const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// //------------------------------------------------- API-1 [/Add exam_question] --------------------------------------------------//



const addExamQuestion = async function (req, res) {
  try {
    let data = req.body;
    let examCourseId = req.body.examCourseId;

    if (!mongoose.Types.ObjectId.isValid(examCourseId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid examCourseId" });
    }

    let check = await exam_courseModel
      .findOne({ _id: examCourseId, isDeleted: false })
      .lean();
    if (!check) {
      return res
        .status(404)
        .send({ status: false, message: "Course doesn't exist" });
    }

    let error = [];
    let err1 = isRequired(data);
    if (err1) error.push(...err1);

    if (error.length > 0)
      return res.status(400).send({ status: false, message: error });

    // Check if the questionImage field exists in the request
    if (req.file && req.file.path) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mankantlaweducation/questionImage",
      });
      data.questionImage = result.secure_url;
    }
    
    let created = await examQuestionModel.create(data);
    res.status(201).send({
      status: true,
      message: "Exam question created successfully",
      data: created,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};


//====================================================== Get exam Question By Id ===================================================================//
const getExamQuestionById = async (req, res) => {
  try {
    const data = req.body.examQuesId;

    if (!isValidObjectId(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Invaild exam_question Id" });
    }
    //find the examQuesId which is deleted key is false--
    let exam_question = await examQuestionModel.findOne({
      _id: data,
      isDeleted: false,
    });

    if (!exam_question) {
      return res
        .status(404)
        .send({ status: false, message: "No exam_question Available!!" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: exam_question });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};
//====================================================== Get All exam Course  ===================================================================//

const getAllExam_question = async function (req, res) {
  try {
    let exam_questionPresent = await examQuestionModel.find({
      isDeleted: false,
    });
    res.status(200).send({ status: true, data: exam_questionPresent });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
//====================================================== Get All exam Course By Id===================================================================//


const getByExamId = async function (req, res) {
  try {
    const data = req.body.examCourseId;
    const pageno = req.body.pageno;
    const newpageno = pageno - 1;
    let pCount = 10;
    const ispage = req.body.isPagination;
    let examQuestion = [];

    if (ispage == 1) {
      examQuestion = await examQuestionModel
        .find({ examCourseId: data, isDeleted: false })
        .skip(newpageno * pCount)
        .limit(pCount);
    } else {
      examQuestion = await examQuestionModel
        .find({ examCourseId: data, isDeleted: false });
    }

    if (!isValidObjectId(data)) {
      return res.status(400).send({ status: false, message: "Invalid exam CourseId" })
    }

    let PresentAll = await examQuestionModel
      .find({ examCourseId: data, isDeleted: false });
    let exam_question_count = ispage == 1 ? Math.ceil(PresentAll.length / pCount) : PresentAll.length;

    return res.status(200).send({ status: true, data: examQuestion, exam_question_count });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
}


//====================================================== Get By examCourse_slug===================================================================//
const getByexamSlug = async (req, res) => {
  try {
    const title_slug = req.body.title_slug;

    let examExists = await exam_courseModel.findOne({
      title_slug: title_slug,
      isDeleted: false,
    });

    if (!examExists) {
      return res.status(404).send({
        status: false,
        message: "exam Course_slug does not exist",
      });
    }

    let questions = await examQuestionModel
      .find({ examCourseId: examExists._id, isDeleted: false })
      .select({ exam_question: 1 })
      .lean();

    for (let question of questions) {
      const answers = await examAnsModel
        .find({ examQuesId: question._id, isDeleted: false })
        .select({ exam_answer: 1, isCorrect: 1 })
        .lean();
      if (answers && answers.length > 0) {
        question.isObjective = 1;
        question.answers = answers;
      } else {
        question.isObjective = 0;
        question.answers = [];
      }
    }

    if (!questions) {
      return res.status(404).send({
        status: false,
        message: "exam Course answers do not exist",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Success",
      title_slug: title_slug,
      questions: questions,
    });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};



//====================================================== getResultByexamSlug===================================================================//


const getResultByexamSlug = async (req, res) => {
  try {
    const title_slug = req.body.title_slug;
    const userId = req.body.userId;
    let quizExists = await examCourseModel.findOne({
      title_slug: title_slug,
      isDeleted: false,
    });

    if (!quizExists) {
      return res.status(404).send({
        status: false,
        message: "exam Does Not Exist",
      });
    }

    let questions = await examQuesModel
      .find({ 
        examCourseId: quizExists._id, isDeleted: false })
      .select({ _id: 1, exam_question: 1 })
      .lean();

    for (let question of questions) {
      const answers = await examAnsModel
        .find({ examQuesId: question._id.toString(), isDeleted: false })
        .select({ _id: 1, exam_answer: 1, isCorrect: 1 })
        .lean();

      question.answers = [];

      for (let answer of answers) {
        answer.isSubmit = 0;

        const userAnswer = await examResultModel.findOne({
          userId: userId,
          'answer.examQuesId': question._id.toString(),
          'answer.examAnsId': answer._id.toString(),
        });

        if (userAnswer) {
          answer.isSubmit = 1;
        }

        answer.examAnsId = answer._id.toString();
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



// //---------------------------------------------------------Update Api-------------------------------------------------------//

const updateExam_question = async (req, res) => {
  const { examQuesId, exam_question } = req.body;

  const data = {
    exam_question,
  };

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'mankantlaweducation/questionImage'
    });
    data.questionImage = result.secure_url;
  }

  const updatedData = await examQuestionModel.findOneAndUpdate(
    { _id: examQuesId },
    data,
    { new: true }
  );

  if (!updatedData) {
    return res.status(404).json({ message: 'Exam question not found' });
  }

  return res.status(201).json({ updatedData: updatedData });
};



//------------------------------------ Delete exam question ----------------------------------

const deleteExam_question = async (req, res) => {
  try {
    let id = req.body.examQuesId;
    //check wheather objectId is valid or not--
    if (!isValidObjectId(id)) {
      return res
        .status(400)  
        .send({ status: false, message: "please enter valid id" });
    }

    const findexam_question = await examQuestionModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!findexam_question) {
      return res
        .status(404)
        .send({ status: false, message: "No exam_question found" });
    }

    const examAnsCount = await examAnsModel.countDocuments({ examQuesId: id });

    if (examAnsCount > 0) {
      return res.status(400).send({ status: false, message: "Please delete exam answer first" });
    }

    await examQuestionModel.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "deleted sucessfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "error", msg: err.message });
  }
};



module.exports = {
  addExamQuestion,
  getExamQuestionById,
  getAllExam_question,
  getByExamId,
  getByexamSlug,
  getResultByexamSlug,
  updateExam_question,
  deleteExam_question,
};
