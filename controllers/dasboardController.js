const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const videosModel = require("../models/videosModel");
const quizModel = require("../models/quizModel");
const bookingModel = require("../models/bookingModel");
const examBookingModel = require("../models/examBookingModel");
const examModel = require("../models/examModel");


const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const dashboard = async function (req, res) {
  try {
    const userCount = await userModel.countDocuments({ isDeleted: false });
    const courseCount = await courseModel.countDocuments({ isDeleted: false });
    const videosCount = await videosModel.countDocuments({ isDeleted: false });
    const quizCount = await quizModel.countDocuments({ isDeleted: false });
    const bookingCount = await bookingModel.countDocuments({ isDeleted: false });
    const examBookingCount = await examBookingModel.countDocuments({ isDeleted: false });
    const examCount = await examModel.countDocuments({ isDeleted: false });

    return res.status(200).send({
      status: true,
      userCount,
      courseCount,
      videosCount,
      quizCount,
      bookingCount,
      examBookingCount,
      examCount,
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};



  module.exports={dashboard}