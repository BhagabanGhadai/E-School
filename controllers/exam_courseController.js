const exam_CourseModel = require('../models/exam_CourseModel')
const examBookingModel=require("../models/examBookingModel")
const userModel=require("../models/userModel")
const examQuesModel=require("../models/examQuestionModel")


const cloudinary = require("../utils/cloudinary");
const { isRequired, isValid } = require("../utils/examCourseValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



// //------------------------------------------------- API-1 [/Add exam_Course] --------------------------------------------------//

const exam_CourseAdd = async function (req, res) {
   
    try {
        let data = req.body
        let image= req.image
      
        let error = []
        let err1 = isRequired(data, image)
        if (err1)
            error.push(...err1)


        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "mankantlaweducation/addexam_Course",
              });
              data.image= result.secure_url;
              data.title_slug= slugify(req.body.title);
      
           
      

        let created = await exam_CourseModel.create(data)
        res.status(201).send({ status: true, message: "exam_Course created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
//====================================================== Get examCourse ===================================================================//
const getexamCourseById = async (req, res) => {
    try {
        const data = req.body.examCourseId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild examCourse Id" })
        }
        //find the examCourseId which is deleted key is false--
        let examCourse = await exam_CourseModel.findOne({ _id: data, isDeleted: false })

        if (!examCourse) {
            return res.status(404).send({ status: false, message: "No examCourses Available!!" })
        }
        return res.status(200).send({ status: true, message: 'Success', data: examCourse })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}
//====================================================== Get Course ===================================================================//

const getAllExamCourse = async function (req, res) {
    try {
        let pageno = req.body.pageno;
        let newpageno = pageno - 1;
        let pCount = 10;
        const ispage = req.body.isPagination ;
        let examCourse = []; 

        if(ispage == 1){
            examCourse = await exam_CourseModel.find({isDeleted: false }).skip(newpageno * pCount)
            .limit(pCount);
        } else {
            examCourse = await exam_CourseModel.find({isDeleted: false }).skip(newpageno * pCount)
            .limit(pCount);
        }
       
        let examCourseAll = await exam_CourseModel.find({isDeleted: false });
        let exam_course_count = Math.ceil(examCourseAll.length/pCount);
        res.status(200).send({status:true, data: examCourse, exam_course_count})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

//====================================================== get All User ===================================================================//

const getAllUser = async function (req, res) {
    try {
        let userId = req.body.userId;
        let pageno = req.body.pageno;
        let newpageno = pageno - 1;
        let pCount = 3;
        const ispage = req.body.isPagination 
        let examCourse = [];
    
        if (ispage == 1) {
          examCourse =   await exam_CourseModel.find({ isDeleted: false }).skip(newpageno * pCount)
          .limit(pCount);
        } else {
          examCourse =  await exam_CourseModel.find({ isDeleted: false }).skip(newpageno * pCount)
          .limit(pCount);
        }
        let user = await userModel.findOne({ _id: userId, isDeleted: false });

        if (!user) {
            return res.status(404).send({ status: false, message: "No users Available!!" });
        }
    
   
    
        let exam_course_count = await exam_CourseModel.countDocuments({ isDeleted: false });
    
        let examBookingUser = await examBookingModel.findOne({ user: userId });

        let response = { 
            status: true, 
            data: examCourse, 
            exam_course_count,
            isBooking: examBookingUser ? 1 : 0
        };
        
        res.status(200).send(response);
    
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};












// //--------------------------------------------------------- Update Api -------------------------------------------------------//


const examCourseUpdate = async function (req, res) {
    try {

        const { examCourseId, title,description,price,mrp } = req.body;

        const data = {
            title,
            description,
            price,
            mrp,
            title_slug: `${slugify(req.body.title)}`,
        }
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'mankantlaweducation/addexam_Course' });
            data.image = result.secure_url;
    
        }
        
        const updatedData = await exam_CourseModel.findOneAndUpdate({ _id: examCourseId }, data, { new: true });
        return res.status(201).json({ updatedData: updatedData });

        
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}




// ------------------------------------ Delete Exam Course ----------------------------------

const deleteExamCourse = async function (req, res) {
    try {
        const examCourseId = req.body.examCourseId
        if (!isValidObjectId(examCourseId)) {
            return res.status(400).send({ status: false, msg: "examCourseId is invalid" });
        }

        // Check if there are any exam questions associated with the exam course
        const count = await examQuesModel.countDocuments({ examCourseId: examCourseId, isDeleted: false })
        if (count > 0) {
            return res.status(400).send({ status: false, message: 'Please first delete the exam questions ' })
        }

        const deletedDetails = await exam_CourseModel.findOneAndUpdate(
            { _id: examCourseId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (!deletedDetails) {
            return res.status(404).send({ status: false, message: 'exam course does not exist' })
        }
        return res.status(200).send({ status: true, message: 'exam Course deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports ={exam_CourseAdd,getAllUser,getexamCourseById,getAllExamCourse,examCourseUpdate,deleteExamCourse }