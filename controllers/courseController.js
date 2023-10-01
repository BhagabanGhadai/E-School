const courseModel = require('../models/courseModel')
const courseBatchModel = require("../models/courseBatchModel");
const courseBatchHighlightModel = require("../models/courseBatchHighlight");
const chapterModel = require('../models/chapterModel')
const videosModel = require('../models/videosModel')
const quizModel = require('../models/quizModel')
const bookingModel = require('../models/bookingModel')
const courseSubjectModel = require('../models/courseSubjectModel')
const mockCourseModel = require('../models/mockCourseModel')
const moment = require('moment');



const cloudinary = require("../utils/cloudinary");
const { isRequired, isInvalid, isValid } = require("../utils/courseValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



// //------------------------------------------------- API-1 [/Add Course] --------------------------------------------------//

const courseAdd = async function (req, res) {
   
    try {
        let data = req.body
        let thumbnail= req.thumbnail
        let chapterIds = JSON.parse(req.body.chapterIds);
        let mockIds = JSON.parse(req.body.mockIds);
        let batchHighlights = JSON.parse(req.body.batchHighlights);
        
      
        let error = []
        let err1 = isRequired(data, thumbnail)
        if (err1)
            error.push(...err1)

        let err2 = isInvalid(data, thumbnail)
        if (err2)
            error.push(...err2)

        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "mankantlaweducation/addcourse",
              });
              data.thumbnail= result.secure_url;
              data.course_slug= slugify(req.body.course_title);
      
           
      

        let created = await courseModel.create(data);
        let courseId = created._id.toString();

        //Add chapters in course

        for(let i = 0; i < chapterIds.length; i++){
            let dataSub = {
                courseId: courseId,
                chapterId: chapterIds[i]
            }

             let checkCourseSubject = await courseSubjectModel
               .findOne({ courseId: courseId, chapterId: chapterIds[i], removeStatus: false, isDeleted: false })
               .lean();
             if (!checkCourseSubject) {
                    let assignSub = await courseSubjectModel.create(dataSub);
             }

        }

        //Add mocks in course

        for(let i = 0; i < mockIds.length; i++){
            let dataSub = {
                courseId: courseId,
                mockId: mockIds[i]
            }

             let checkMockCourse = await mockCourseModel
               .findOne({ courseId: courseId, mockId: mockIds[i], removeStatus: false, isDeleted: false })
               .lean();
             if (!checkMockCourse) {
                    let assignSub = await mockCourseModel.create(dataSub);
             }

        }

        let courseBatchData = {
          title: req.body.courseBatchTitle,
          description: req.body.courseBatchDescription,
          courseId: courseId,
        };

        //Add course batch
        let batchCreated = await courseBatchModel.create(courseBatchData);
        let courseBatchId = batchCreated._id.toString();

        //Add course batch highlights
         for (let i = 0; i < batchHighlights.length; i++) {
           let dataSub = {
             courseBatchId: courseBatchId,
             title: batchHighlights[i],
           };

           console.log(dataSub);
           
             let assignSub = await courseBatchHighlightModel.create(dataSub);
         }


        res.status(201).send({ status: true, message: "Course created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//====================================================== Get Course By Id ===================================================================//
const getcourseById = async (req, res) => {
    try {
        const data = req.body.courseId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild course Id" })
        }
        //find the courseId which is deleted key is false--
        let course = await courseModel.findOne({ _id: data, isDeleted: false })

        if (!course) {
            return res.status(404).send({ status: false, message: "No courses Available!!" })
        }
        return res.status(200).send({ status: true, count: course.length, message: 'Success', data: course })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}


//====================================================== Get All Course ===================================================================//

const getcourse = async function (req, res) {
    try {
       
        let coursePresent = await courseModel.find({isDeleted: false })
        res.status(200).send({status:true, data: coursePresent})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


  


//======================================================Get course By Slug ===================================================================//
const getcourseSlug = async function (req, res) {
    try {
        const data = req.body.course_slug
        //find the courseId which is deleted key is false--
        let course = await courseModel.findOne({course_slug:data})

        if (!course) {
            return res.status(404).send({ status: false, message: "No courses Available!!" })
        }
       
      
        res.status(200).send({status:true, data: course})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
//======================================================Get course By UserId===================================================================//
const getByUserId = async function (req, res) {
    try {
        const { userId } = req.body;
        let courses = await courseModel.find({ isDeleted: false });
        let bookings = await bookingModel.find({ user: userId });
        // if(!bookings.user){
        //     res.status(404).send({ status: false, message: "user Not found" })
        // }

        let courseData = courses.map(course => {
            let isBooking = bookings.some(booking => {
                return booking.course.toString() === course._id.toString();
            });
            return {
                ...course.toObject(),
                isBooking: isBooking ? 1 : 0
            };
        });

        res.status(200).send({ status: true, data: courseData });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
//======================================================Get course By Slug User===================================================================//

const getBySlugUser = async function (req, res) {
    try {
      const { userId, course_slug } = req.body;
  
      const courses = await courseModel.find({ isDeleted: false, course_slug: course_slug });
  
      let courseData = null;
  
      if (courses.length > 0) {
        const courseId = courses[0]._id;
  
        const booking = await bookingModel.findOne({ user: userId, courseId });
  
        const isBooking = !!booking;
  
        courseData = {
          ...courses[0].toObject(),
          isBooking: isBooking ? 1 : 0
        };
      }
  
      res.status(200).send({ status: true, data: courseData || { isBooking: 0 } });
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: false, msg: err.message });
    }
  }
  

//====================================================== Get All By Admin ===================================================================//


const getAllByAdmin = async function (req, res) {
    try {
        const pageno = req.body.pageno;
        const newpageno = pageno-1;
        const pCount = 10;
        const ispage = req.body.isPagination ;
        let courses = []; 

        if(ispage == 1){
            courses = await courseModel.find({ isDeleted: false }).skip(newpageno*pCount).limit(pCount); // Assign value to courses variable
        } else {
            courses = await courseModel.find({ isDeleted: false }); 
        }

        const allcourses = await courseModel.find({ isDeleted: false });

        const course_count = Math.ceil(allcourses.length/pCount);

        const coursesWithCount = await Promise.all(
            courses.map(async (course) => {
                const chapterCount = await courseSubjectModel.countDocuments({ courseId: course._id, removeStatus: false, isDeleted: false });
                const quizCount = await mockCourseModel.countDocuments({ courseId: course._id, removeStatus: false, isDeleted: false });
                const studentCount = await bookingModel.countDocuments({ course: course._id, isDeleted: false });
                const getCourseBatchCount = await courseBatchModel.countDocuments({
                    courseId: course._id,
                    isDeleted: false,
                  });
                let batch_id = '';
                if(getCourseBatchCount>0){
                    const getCourseBatch = await courseBatchModel.findOne({
                      courseId: course._id,
                    });
                    batch_id = getCourseBatch._id;
                }
                
                return {
                  _id: course._id,
                  courseBatchId: batch_id,
                  course_title: course.course_title,
                  price: course.price,
                  status: course.status,
                  thumbnail: course.thumbnail,
                  chapterCount,
                  quizCount: quizCount,
                  studentCount,
                  date_created: moment(course.createdAt).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ),
                };
            })
        );

        res.status(200).send({ status: true, data: coursesWithCount, course_count: allcourses.length });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};



  


  

  
// //--------------------------------------------------------- Update Api -------------------------------------------------------//


const updateCourse = async function (req, res) {
    try {

       const { course_id} = req.body;
    
        const data = {
            short_description:req.body.short_description,
            detail_description:req.body.detail_description,
            highlights:req.body.highlights,
            price:req.body.price,
            mrp:req.body.mrp,
            course_title:req.body.course_title,
            course_admin_title:req.body.course_admin_title,
            course_slug: `${slugify(req.body.course_title)}`,
        }
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'mankantlaweducation/addcourse' });

            data.thumbnail = result.secure_url;
    
        }
    
        const updatedData = await courseModel.findOneAndUpdate({ _id:course_id}, data, { new: true });
        return res.status(201).json({ updatedData:updatedData });

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}


// ------------------------------------ Delete Course ----------------------------------

const deleteCourse = async function (req, res) {
    try {
        const courseId = req.body.courseId;
        if (!isValidObjectId(courseId)) {
            return res.status(400).send({ status: false, msg: "courseId is invalid" });
        }

        const count = await chapterModel.countDocuments({ courseId: courseId });
        if (count > 0) {
            return res.status(400).send({ status: false, message: "Please first delete the chapters" });
        }

        const deletedDetails = await courseModel.findOneAndUpdate(
            { _id: courseId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true });

        if (!deletedDetails) {
            return res.status(404).send({ status: false, message: 'course does not exist' })
        }
        return res.status(200).send({ status: true, message: 'Course deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}





const getcourseVideoDetails = async function (req, res) {
    try {
        const phoneNumber = req.query.phoneNumber;
        const userName = req.query.userName;
        const folder = 'videos'; // Specify the folder name where the video is located
    
        // Generate a secure video URL with the overlay
        const videoUrl = cloudinary.url(`${folder}/pVG7KuX0EejI2Xzf_OtTt1qkQqk`, {
          transformation: [
            {
              overlay: {
                font_family: 'Arial',
                font_size: 40,
                text: `${userName} - ${phoneNumber}`,
              },
              gravity: 'north',
              y: 10,
              flags: 'relative',
            },
          ],
          secure: true,
        });
    
        // Return the video URL with the overlay to the video player
        res.send(`
          <video width="640" height="480" controls>
            <source src="${videoUrl}" type="video/mp4">
          </video>
        `);
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


      
      

module.exports = {courseAdd,updateCourse,deleteCourse,getByUserId,getBySlugUser,getcourseSlug,getAllByAdmin,getcourseById,getcourse,getcourseVideoDetails}

