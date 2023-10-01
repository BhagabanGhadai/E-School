const bookingModel = require("../models/bookingModel");
const courseModel = require("../models/courseModel");
const userModel = require("../models/userModel");
const chapterModel = require("../models/chapterModel");
const videosModel = require("../models/videosModel");
const courseSubjectModel = require('../models/courseSubjectModel')
const mockCourseModel = require('../models/mockCourseModel')
const user_macAddressModel = require("../models/user_macAddressModel");



const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// //------------------------------------------------- API-1 [/Add booking] --------------------------------------------------//

const bookingAdd = async function (req, res) {
  try {
    const { userId, courseId, orderId, transactionId } = req.body;

    if (!isValidObjectId(courseId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid courseId" });
    }

    let checkCourse = await courseModel
      .findOne({ _id: courseId, isDeleted: false })
      .lean();
    if (!checkCourse) {
      return res
        .status(404)
        .send({ status: false, message: "Course does not exist" });
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

    let existingBooking = await bookingModel
      .findOne({ user: userId, course: courseId })
      .lean();
    if (existingBooking) {
      return res
        .status(409)
        .send({ status: false, message: "User has already purchased this course" });
    }

    let bookingData = { user: userId, course: courseId, orderId: orderId, transactionId: transactionId };
    let created = await bookingModel.create(bookingData);
    res
      .status(201)
      .send({
        status: true,
        message: "Booking created successfully",
        data: created,
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};




//====================================================== Get booking By Id ===================================================================//
const getbookingId = async (req, res) => {
  try {
      const data = req.body.bookingId 

      if (!isValidObjectId(data)) {
          return res.status(400).send({ status: false, message: "Invaild bookingId " })
      }
      //find the bookingId  which is deleted key is false--
      let booking = await bookingModel.findOne({ _id: data, isDeleted: false })

      if (!booking) {
          return res.status(404).send({ status: false, message: "No booking Batch Available!!" })
      }
      return res.status(200).send({ status: true,  message: 'Success', data: booking })
  }
  catch (error) {
      res.status(500).send({ Error: error.message })
  }
}
//====================================================== Get booking By user Id ===================================================================//

const getbookingByUserId = async (req, res) => {
  try {
    const userId = req.body.userId;
    const bookings = await bookingModel
      .find({ user: userId, isDeleted: false })
      .lean();

    const result = [];

    for (let i = 0; i < bookings.length; i++) {
      const courseId = bookings[i].course;
      if (!courseId) continue; // skip bookings without courseId

      const course = await courseModel
        .findOne({ _id: courseId, isDeleted: false })
        .select({
          course_title: 1,
          short_description: 1,
          price: 1,
          mrp: 1,
          thumbnail: 1,
          course_slug:1,
        })
        .lean();

      if (!course) continue; // skip bookings with invalid courseId

      const chapterCount = await courseSubjectModel.countDocuments({ courseId: course._id, removeStatus: false, isDeleted: false });
                const quizCount = await mockCourseModel.countDocuments({ courseId: course._id, removeStatus: false, isDeleted: false });
  
        course.mock_count = quizCount;
        course.chapter_count = chapterCount;
  
        result.push(course);
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

//====================================================== Get All Enroll Users  ===================================================================//

const getAllEnrollUsers = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ isDeleted: false })
      .populate('user', '_id full_name email phone')

    const users = [];
    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];

      if (booking.course && !users.some(user => user._id === booking.user._id)) {
        users.push({
          _id: booking.user._id,
          full_name: booking.user.full_name,
          phone: booking.user.phone,
          email: booking.user.email,
        });
      }
    }

    return res.status(200).send({
      status: true,
      message: "success",
      users: users,
    });
  } catch (error) {
    console.error(`Error while searching for bookings: ${error.message}`);
    return res.status(500).send({ Error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find({ isDeleted: false }).select({full_name:1, phone:1, email:1, status:1, force_logout_status:1});

      const updatedData = await Promise.all(
        users.map(async (user) => {
            const courseEnrolled = await bookingModel
            .find({ user: user._id.toString()}).select({course:1}).populate('course',["course_title"]);

            const fingerDetails = await user_macAddressModel
            .find({ userId: user._id.toString()}).select({macAddress:1, isDevice: 1});
            
            return {
                _id: user._id,
                name: user.full_name,
                phone: user.phone,
                email: user.email,
                status: user.status,
                force_logout_status: user.force_logout_status,
                courseEnrolled,
                fingerDetails
            };
        })
    );

    return res.status(200).send({
      status: true,
      message: "success",
      data: updatedData,
    });
  } catch (error) {
    console.error(`Error while searching for bookings: ${error.message}`);
    return res.status(500).send({ Error: error.message });
  }
};

//====================================================== enrolled courses of that student   ===================================================================//

const enrollCourseOfUser = async (req, res) => {
  try {
    const userId = req.body.userId;

    const bookings = await bookingModel
      .find({ isDeleted: false, user: userId })
      .populate('user', '_id full_name email phone')
      .populate('course', '_id course_title');

    const user = {
      _id: bookings[0].user._id,
      full_name: bookings[0].user.full_name,
      phone: bookings[0].user.phone,
      email: bookings[0].user.email,
      enrolled_courses: [],
    };

    bookings.forEach((booking) => {
      user.enrolled_courses.push({
        _id: booking.course._id,
        title: booking.course.course_title,
      });
    });

    return res.status(200).send({
      status: true,
      message: 'success',
      user: user,
    });
  } catch (error) {
    console.error(`Error while searching for bookings: ${error.message}`);
    return res.status(500).send({ Error: error.message });
  }
};

  
//====================================================== Get All booking  ===================================================================//


const getAllbooking  = async function (req, res) {
  try {
  const pageno = req.body.pageno;
  const newpageno = pageno - 1;
  const pCount = 3;
  const isPagination = req.body.isPagination;
  let bookings = [];
  

  if (isPagination == 1) {
    bookings = await bookingModel
      .find()
      .skip(newpageno * pCount)
      .limit(pCount)
      .lean();
  } else {
    bookings = await bookingModel.find().lean();
  }
  
  const bookingsAll = await bookingModel.find();
  const booking_count = Math.ceil(bookingsAll.length / pCount);
  
  const result = [];
  
  for (let i = 0; i < bookings.length; i++) {
    const courseId = bookings[i].course;
    if (!courseId) continue; // skip bookings without courseId
  
    const course = await courseModel
      .findOne({ _id: courseId })
      .select({
        course_title: 1,
        price: 1,
        mrp: 1,
        thumbnail: 1,
      })
      .lean();
  
    if (!course) continue; // skip bookings with invalid courseId
  
    const user = await userModel
      .findOne({ _id: bookings[i].user })
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
    bookings: result,
    booking_count,
    data: bookings,
  });
  } catch (err) {
  res.status(500).send({ status: false, msg: err.message });
  }
  };
  

  
  
  
  
  
  


// //---------------------------------------------------------Update Api-------------------------------------------------------//

const updatebooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const data = {
      status: req.body.status,
    };

    const updatedData = await bookingModel.findOneAndUpdate(
      { _id: bookingId },
      [{ $addFields: data }],
      { new: true }
    );

    return res.status(201).json({ data: updatedData });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//------------------------------------ Delete booking ----------------------------------

const deletebooking = async (req, res) => {
  try {
    let id = req.body.bookingId;

    //check wheather objectId is valid or not--
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid id" });
    }

    const findbooking = await bookingModel.findOne({ _id: id });

    if (!findbooking) {
      return res
        .status(404)
        .send({ status: false, message: "No booking found" });
    }

    await bookingModel.findOneAndUpdate(
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

module.exports = {
  bookingAdd,
  deletebooking,
  getbookingByUserId,
  getAllbooking,
  getAllEnrollUsers,
  getAllUsers,
  enrollCourseOfUser,
  getbookingId,
  updatebooking,
};
