const examResultModel = require("../models/examResultModel");
const examCourseModel = require("../models/exam_CourseModel");
const userModel = require("../models/userModel");
const examAnsModel = require("../models/exam_answerModel");
const examQuesModel = require("../models/examQuestionModel");




const mongoose = require("mongoose");
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// //------------------------------------------------- API-1 [/Adding quiz Result Add] --------------------------------------------------//


const examResultAdd = async function (req, res) {
    try {
      const data = req.body;
      const title_slug = data.title_slug;
      const userId = data.userId;
  
      if (!isValidObjectId(userId)) {
        return res.status(400).send({ status: false, message: "Invalid user Id" });
      }
  
      // Check if the user has already submitted quiz result
      const existingResult = await examResultModel.findOne({ userId, title_slug });
  
      if (existingResult) {
        return res.status(400).send({ status: false, message: "You have already submitted" });
      }
  
      let user = await userModel.findOne({ _id: userId, isDeleted: false });
  
      if (!user) {
        return res.status(404).send({ status: false, message: "User not found" });
      }
  
      const examCourse = await examCourseModel.findOne({ title_slug: title_slug, isDeleted: false }).lean();
  
      if (!examCourse) {
        return res.status(404).send({ status: false, message: "Exam not found" });
      }
  
      const examCourseId = examCourse._id;
  
      const examAnswers = await examAnsModel.find({ examCourseId });
  
      if (Array.isArray(data.answer)) {
        const quizResult = data.answer.map((answer) => {
          const examQuesId = answer.examCourseId; // Modified field name to examQuesId
          const examAnsId = answer.answerId; // Modified field name to examAnsId
          return { examQuesId, examAnsId };
        });
  
        const created = await examResultModel.create({
          examCourseId: examCourseId,
          answer: quizResult,
          userId: userId,
          title_slug: title_slug,
        });
  
        res.status(201).send({
          status: true,
          message: "Exam result created successfully",
        });
      } else {
        return res.status(400).send({ status: false, message: "Invalid answer format" });
      }
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };
  



module.exports = {
    examResultAdd
  };