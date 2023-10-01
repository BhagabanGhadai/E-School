const examBookingModel = require("../models/examBookingModel");
const examCourseModel = require("../models/exam_CourseModel");
const userModel = require("../models/userModel");
const chapterModel = require("../models/chapterModel");
const videosModel = require("../models/videosModel");
const { isRequired,  isValid} = require("../utils/examBookingValidation")
const examResultModel = require("../models/examResultModel");

const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// //------------------------------------------------- API-1 [/Add examBooking] --------------------------------------------------//

const examBookingAdd = async function (req, res) {
  try {
    const { userId, examCourseId, orderId, transactionId } = req.body;
    let data = req.body;
    let error = [];
    let err1 = isRequired(data);
    if (err1) error.push(...err1);

    if (error.length > 0)
      return res.status(400).send({ status: false, message: error });

    if (!isValidObjectId(examCourseId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid examCourseId" });
    }

    let checkexamCourse = await examCourseModel
      .findOne({ _id: examCourseId, isDeleted: false })
      .lean();
    if (!checkexamCourse) {
      return res
        .status(404)
        .send({ status: false, message: "examCourse does not exist" });
    }

    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid userId" });
    }

    let checkUser = await userModel.findOne({ _id: userId }).lean();
    if (!checkUser) {
      return res
        .status(404)
        .send({ status: false, message: "User does not exist" });
    }

    let existingBooking = await examBookingModel.findOne({ userId, examCourseId });
    if (existingBooking) {
      return res
        .status(400)
        .send({ status: false, message: "You have already purchased this exam course" });
    }

    let examBookingData = {
      userId,
      examCourseId,
      orderId,
      transactionId,
    };
    let created = await examBookingModel.create(examBookingData);

    res.status(201).send({
      status: true,
      message: "examBooking created successfully",
      data: created,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

  //====================================================== Get booking By Id ===================================================================//
const getBybookingExamId = async (req, res) => {
    try {
        const data = req.body.examBookingId 
  
        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild examBookingId " })
        }
        //find the BybookingExamId  which is deleted key is false--
        let examBooking = await examBookingModel.findOne({ _id: data, isDeleted: false })
  
        if (!examBooking) {
            return res.status(404).send({ status: false, message: "No examBooking  Available!!" })
        }
        return res.status(200).send({ status: true,  message: 'Success', data: examBooking })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
  }
  //====================================================== Get booking By user Id ===================================================================//

  const getbookingByUserId = async (req, res) => {
    try {
      const userId = req.body.userId;
      const bookings = await examBookingModel
        .find({ userId: userId, isDeleted: false })
        .lean();
  
      const result = [];
  
      for (let i = 0; i < bookings.length; i++) {
        const examCourseId = bookings[i].examCourseId;
        if (!examCourseId) continue; // skip bookings without examCourseId
  
        const course = await examCourseModel
          .findOne({ _id: examCourseId, isDeleted: false })
          .select({
            title: 1,
            title_slug: 1,
            description: 1,
            price: 1,
            mrp: 1,
            image: 1,
          })
          .lean();
  
        if (!course) continue; // skip bookings with invalid examCourseId
  
        const isAttempted = await examResultModel.exists({ userId: userId, examCourseId: examCourseId });
        result.push({ ...course, isAttempted: isAttempted ? 1 : 0 });
      }
  
      return res.status(200).send({
        status: true,
        message: "success",
        courses: result,
      });
    } catch (error) {
      console.error(`Error while searching for bookings: ${error.message}`);
      return res.status(500).send({ Error: error.message });
    }
  };
  


  
  
  


  //====================================================== Get All Exam booking  ===================================================================//


  const getAllExambooking = async function (req, res) {
    try {
      const pageno = req.body.pageno;
      const newpageno = pageno - 1;
      const pCount = 10;
      const ispage = req.body.isPagination ;
      let examBooking = [];
  
      if (ispage == 1) {
        examBooking = await examBookingModel
          .find()
          .skip(newpageno * pCount)
          .limit(pCount)
          .lean();
  
      } else {
        examBooking = await examBookingModel
          .find()
          .skip(newpageno * pCount)
          .limit(pCount)
          .lean();
      }
  
  
      const bookings = await examBookingModel
        .find();
      const exam_booking_count = Math.ceil(bookings.length / pCount);
  
      const result = [];
  
      for (let i = 0; i < bookings.length; i++) {
        const examCourseId = bookings[i].examCourseId;
        if (!examCourseId) continue;
  
        const course = await examCourseModel
          .findOne({ _id: examCourseId })
          .select({
            title: 1,
            description: 1,
            price: 1,
            mrp: 1,
            image: 1,
          })
          .lean();
  
        if (!course) continue; // skip bookings with invalid examCourseId
  
        const user = await userModel
          .findOne({ _id: bookings[i].userId })
          .select({
            full_name: 1,
            email: 1,
          })
          .lean();
  
        if (!user) continue; // skip bookings with invalid userId
  
        result.push({
          booking_id: bookings[i]._id,
          course,
          user,
        });
      }
  
      return res.status(200).send({
        status: true,
        message: "success",
        examBooking: result,
        exam_booking_count,
        data: examBooking,
       
      });
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  }; 
  

  // //---------------------------------------------------------Update Api-------------------------------------------------------//

const updateExambooking = async (req, res) => {
    try {
      const { examBookingId } = req.body;
  
      const data = {
        status: req.body.status,
      };
  
      const updatedData = await examBookingModel.findOneAndUpdate(
        { _id: examBookingId },
        [{ $addFields: data }],
        { new: true }
      );
  
      return res.status(201).json({ data: updatedData });
    } catch (err) {
      res.status(500).send({ status: false, message: err.message });
    }
  };
  
  //------------------------------------ Delete booking ----------------------------------
  
  const deleteExamBooking = async (req, res) => {
    try {
      let id = req.body.examBookingId;
  
      //check wheather objectId is valid or not--
      if (!isValidObjectId(id)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter valid id" });
      }
  
      const findbooking = await examBookingModel.findOne({ _id: id });
  
      if (!findbooking) {
        return res
          .status(404)
          .send({ status: false, message: "No exam booking found" });
      }
  
      await examBookingModel.findOneAndUpdate(
        { _id: id },
        { $set: { isDeleted: true } },
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

module.exports ={examBookingAdd,getBybookingExamId,getbookingByUserId,getAllExambooking,updateExambooking,deleteExamBooking}