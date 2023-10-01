const courseModel = require('../models/courseModel')
const courseBatchModel = require('../models/courseBatchModel')
const courseBatchHightlightModel = require('../models/courseBatchHighlight')
const facultyModel = require('../models/facultyModel')
const facultyDegreeModel = require('../models/facultyDegreeModel')
const bookingModel = require('../models/bookingModel')


const mongoose = require("mongoose");
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};


// //------------------------------------------------- API-1 [/Get List] --------------------------------------------------//
const getCourseDetails = async function (req, res) {
  try {
    let courseId = req.body.courseId;
    let filter = { $and: [{ isDeleted: false }] };

    if (!isValidObjectId(courseId)) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid furniture Id" });
    }

    let courses = await courseModel
      .findOne({ _id: courseId, isDeleted: false }).select({course_title : 1,price:1,mrp:1,thumbnail:1 })
      .lean();
    if (!courses) {
      return res
        .status(404)
        .send({ status: false, message: "courseId does'nt exist" });
    }

    let courseBatch = await courseBatchModel
    .findOne({ filter })
    .select({ title: 1,description:1 });

    let courseHighlight = await courseBatchHightlightModel
    .find({ filter })
    .select({ title: 1,description:1 });

    let faculty = await facultyModel
    .find({ filter })
    .select({ name: 1,designation:1,image:1 });

   
    let facultyDegree = await facultyDegreeModel
    .find({ filter })
    .select({ short_description: 1,image:1,university:1, }); 

    //data creation
    return res
      .status(200)
      .send({
        status: true,
        message: "sucess",
        data: { courses, courseBatch, courseHighlight, faculty, facultyDegree },
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

// //------------------------------------------------- API-2 [/Get by course slug] --------------------------------------------------//
const getCourseDetailsBySlug = async function (req, res) {
  try {
    let course_slug = req.body.course_slug;
    let filter = { $and: [{ isDeleted: false }] };

    // Find courseId using course_slug
    let courseData = await courseModel.findOne({ course_slug: course_slug });

    if (!courseData) {
      return res.status(400).send({
        status: false,
        message: "Please enter a valid course_slug",
      });
    }

    let courseId = courseData._id;
    let courses = await courseModel
      .findOne({ _id: courseId, isDeleted: false }).select({course_title : 1,price:1,mrp:1,thumbnail:1 })
      .lean();
    if (!courses) {
      return res
        .status(404)
        .send({ status: false, message: "courseId does'nt exist" });
    }

    let courseBatch = await courseBatchModel
    .findOne({ filter })
    .select({ title: 1,description:1 });

    let courseHighlight = await courseBatchHightlightModel
    .find({ filter })
    .select({ title: 1,description:1 });

    let faculty = await facultyModel
    .find({ filter })
    .select({ name: 1,designation:1,image:1 });

   
    let facultyDegree = await facultyDegreeModel
    .find({ filter })
    .select({ short_description: 1,image:1,university:1, }); 

    //data creation
    return res
      .status(200)
      .send({
        status: true,
        message: "sucess",
        data: { courses, courseBatch, courseHighlight, faculty, facultyDegree },
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
// //------------------------------------------------- API-3 [/Get Course User] --------------------------------------------------//

const getCourseUser = async function (req, res) {
  try {
    let courseId = req.body.courseId;
    let userId = req.body.userId;

    let filter = { $and: [{ isDeleted: false }] };

    if (!isValidObjectId(courseId)) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid furniture Id" });
    }

    let courses = await courseModel
      .findOne({ _id: courseId, isDeleted: false })
      .select({ course_title: 1, price: 1, mrp: 1, thumbnail: 1 })
      .lean();

    if (!courses) {
      return res
        .status(404)
        .send({ status: false, message: "courseId does'nt exist" });
    }

    // Check if the user has booked this course
    let booking = await bookingModel.findOne({
      user: userId,
      course: courseId,
    });

    if (booking) {
      courses.isBooking = 1;
    }
    if (!booking) {
      courses.isBooking = 0;
    }

    let courseBatch = await courseBatchModel
      .findOne({ filter })
      .select({ title: 1, description: 1 });

    let courseHighlight = await courseBatchHightlightModel
      .find({ filter })
      .select({ title: 1, description: 1 });

    let faculty = await facultyModel
      .find({ filter })
      .select({ name: 1, designation: 1, image: 1 });

    let facultyDegree = await facultyDegreeModel
      .find({ filter })
      .select({ short_description: 1, image: 1, university: 1 });

    //data creation
    return res.status(200).send({
      status: true,
      message: "sucess",
      data: { courses, courseBatch, courseHighlight, faculty, facultyDegree },
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};
  
  // //------------------------------------------------- API-3 [/get Course User Details By Slug ] --------------------------------------------------//

  const getCourseUserDetailsBySlug = async function (req, res) {
    try {
      let course_slug = req.body.course_slug;
      let userId = req.body.userId;
      let filter = { $and: [{ isDeleted: false }] };
  
      // Find courseId using course_slug
      let courseData = await courseModel.findOne({ course_slug: course_slug });
  
      if (!courseData) {
        return res.status(400).send({
          status: false,
          message: "Please enter a valid course_slug",
        });
      }
  
      let courseId = courseData._id;
  
      // Check if the user has booked this course
      let booking = await bookingModel.findOne({
        user: userId,
        course: courseId,
      });
  
      let courses = {};
  
      if (booking) {
        courses.isBooking = 1;
      } else {
        courses.isBooking = 0;
      }
  
      courses.courseDetails = courseData; 
  
      let courseBatch = await courseBatchModel.findOne(filter).select({
        title: 1,
        description: 1,
      });
  
      let courseHighlight = await courseBatchHightlightModel.find(filter).select({
        title: 1,
        description: 1,
      });
  
      let faculty = await facultyModel.find(filter).select({
        name: 1,
        designation: 1,
        image: 1,
      });
  
      let facultyDegree = await facultyDegreeModel.find(filter).select({
        short_description: 1,
        image: 1,
        university: 1,
      });
  
      //data creation
      return res.status(200).send({
        status: true,
        message: "success",
        data: {
          courses,
          courseBatch,
          courseHighlight,
          faculty,
          facultyDegree,
        },
      });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };
  
  
  
  
  
  module.exports ={getCourseDetails,getCourseUser,getCourseDetailsBySlug,getCourseUserDetailsBySlug }