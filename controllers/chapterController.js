const chapterModel = require('../models/chapterModel')
const courseModel = require('../models/courseModel')
const quizModel = require('../models/quizModel')
const videosModel = require('../models/videosModel')
const notesModel = require('../models/notesModel')




const cloudinary = require("../utils/cloudinary");
const { isRequired, isInvalid, isValid} = require("../utils/chapterValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}






// //------------------------------------------------- API-1 [/Add Chapter] --------------------------------------------------//

const chapterAdd= async function (req, res) {
   
    try {
        let data = req.body
        let courseId = req.body.courseId
        let image= req.image

        if (!isValidObjectId(courseId)) {
            return res.status(400).send({ status: false, message: "plz enter valid courseId" })
        }


        let check = await courseModel.findOne({ _id:courseId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "course does'nt exist" })
        }
      
        let error = []
        let err1 = isRequired(data, image)
        if (err1)
            error.push(...err1)

        let err2 = isInvalid(data, image)
        if (err2)
            error.push(...err2)

        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "mankantlaweducation/addchapter",
              });
              data.image= result.secure_url;
              data. chapter_slug= slugify(req.body.chapter_name);
      
           
      

        let created = await chapterModel.create(data)
        res.status(201).send({ status: true, message: "Chapter created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================================== Get Chapter ===================================================================//
const getchapterById = async (req, res) => {
    try {
        const data = req.body.chapterId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild chapter Id" })
        }
        //find the chapterId which is deleted key is false--
        let chapter = await chapterModel.findOne({ _id: data, isDeleted: false })

        if (!chapter) {
            return res.status(404).send({ status: false, message: "No chapters Available!!" })
        }
        return res.status(200).send({ status: true, message: 'Success', data: chapter })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}
//====================================================== Get All Chapter ===================================================================//



const getchapter = async function (req, res) {
  try {
    const courseId = req.body.courseId;
    const pageno = req.body.pageno;
    const newpageno = pageno - 1;
    const pCount = 10;
    const ispage = req.body.isPagination;
    let chapters = [];

    if (ispage == 1) {
      chapters = await chapterModel
        .find({
          courseId: courseId,
          isDeleted: false,
        })
        .skip(newpageno * pCount)
        .limit(pCount);
    } else {
      chapters = await chapterModel
        .find({
          courseId: courseId,
          isDeleted: false,
        });
    }

    if (!isValidObjectId(courseId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid courseId" });
    }

    const chaptersall = await chapterModel
      .find({
        courseId: courseId,
        isDeleted: false,
      });
    const chapter_count = Math.ceil(chaptersall.length / pCount);

    const chapterIds = chapters.map((chapter) => chapter._id);
    const quizCounts = await quizModel.aggregate([
      { $match: { chapterId: { $in: chapterIds } } },
      { $group: { _id: "$chapterId", count: { $sum: 1 } } },
    ]);

    const chaptersWithCount = chapters.map((chapter) => {
      const quizCount = quizCounts.find(
        (quizCount) => quizCount._id.toString() === chapter._id.toString()
      )?.count || 0;

      return {
        _id: chapter._id,
        chapter_name: chapter.chapter_name,
        courseId: chapter.courseId,
        image: chapter.image,
        status: chapter.status,
        isDeleted: chapter.isDeleted,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt,
        __v: chapter.__v,
        quiz_count: quizCount,
      };
    });

    res.status(200).send({ status: true, data: chaptersWithCount, chapter_count });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

  
  
  

//====================================================== Get By Slug ===================================================================//
const getBySlug = async function (req, res) {
    try {
        const course_slug = req.body.course_slug;

        // find the courseId which is deleted key is false
        const course = await courseModel.findOne({course_slug:course_slug });

        if (!course) {
            return res.status(404).send({ status: false, message: "No courses Available!!" });
        }

        // find the chapter data for the given course id and course slug
        const chapters = await chapterModel.find({ courseId: course._id ,course_slug: course_slug});

        res.status(200).send({ status: true, data: chapters });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

// update many showcase
const updateManyShowCase = async function (req, res) {
  try {
    const { showcase } = req.body;
    const category = {
        showCase: showcase
    }
    
    const updatedCategory = await chapterModel.updateMany({}, category, { new: true });

    if(updatedCategory){
      res.status(200).send({ status: true });
    }else{
      res.status(400).send({ status: false });
    }
      
  } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
  }
};
//end update many showcase


// //---------------------------------------------------------Update Api-------------------------------------------------------//


const updatechapter = async (req, res) => {

    const { chapter_id, chapter_name } = req.body;

    const data = {
        chapter_name,
        chapter_slug: `${slugify(req.body.chapter_name)}`,
    }
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'mankantlaweducation/addchapter' });
        data.image = result.secure_url;

    }
    
    const updatedData = await chapterModel.findOneAndUpdate({ _id: chapter_id }, data, { new: true });
    return res.status(201).json({ updatedData: updatedData });
}

//------------------------------------ Delete Chapter ----------------------------------


 

  const deleteChapter = async (req, res) => {
    try {
      const id = req.body.chapterId;
  
      if (!isValidObjectId(id)) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid id" });
      }
  
      const findChapter = await chapterModel.findOne({
        _id: id,
        isDeleted: false,
      });
  
      if (!findChapter) {
        return res
          .status(404)
          .send({ status: false, message: "No chapter found" });
      }
  
      const quizCount = await quizModel.countDocuments({
        chapterId: id,
        isDeleted: false,
      });
  
      const videoCount = await videosModel.countDocuments({
        chapterId: id,
        isDeleted: false,
      });
  
      const notesCount = await notesModel.countDocuments({
        chapterId: id,
        isDeleted: false,
      });
  
      if (quizCount > 0 || videoCount > 0 || notesCount > 0) {
        return res.status(400).send({
          status: false,
          message: "Please First delete quiz, video, and notes",
        });
      }
  
      await chapterModel.findOneAndUpdate(
        { _id: id },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true }
      );
  
      return res
        .status(200)
        .send({ status: true, message: "Chapter deleted successfully" });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send({ status: "error", msg: err.message });
    }
  };
  

module.exports = {chapterAdd,deleteChapter,getchapterById,getBySlug ,getchapter ,updatechapter, updateManyShowCase}