const chapterV2Model = require('../models/chapterV2Model')
const courseModel = require('../models/courseModel')
const quizModel = require('../models/quizModel')
const videosModel = require('../models/videosModel')
const notesModel = require('../models/notesModel')

const courseSubjectModel = require("../models/courseSubjectModel");
const noteSubjectModel = require('../models/noteSubjectModel')
const mockSubjectModel = require('../models/mockSubjectModel')


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
        let image= req.image
        let noteIds = JSON.parse(req.body.noteIds);
        let mockIds = JSON.parse(req.body.mockIds);

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
              data.chapter_slug= slugify(req.body.chapter_name);
      
           
      

        let created = await chapterV2Model.create(data)
        let subjectId = created._id.toString();

        // adding notes to subject

        for(let i = 0; i < noteIds.length; i++){
            let dataSub = {
                notesId: noteIds[i],
                subjectId: subjectId
            }

             let checkNoteSubject = await noteSubjectModel
               .findOne({ notesId: noteIds[i], subjectId: subjectId, removeStatus: false, isDeleted: false })
               .lean();
             if (!checkNoteSubject) {
                    let assignSub = await noteSubjectModel.create(dataSub);
             }

        }
        // adding mock to subject
        for(let i = 0; i < mockIds.length; i++){
          let dataSub = {
              mockId: mockIds[i],
              subjectId: subjectId
          }

           let checkMockSubject = await mockSubjectModel
             .findOne({ mockId: mockIds[i], subjectId: subjectId, removeStatus: false, isDeleted: false })
             .lean();
           if (!checkMockSubject) {
                  let assignMock = await mockSubjectModel.create(dataSub);
           }

      }

        res.status(201).send({ status: true, message: "Subject created Successfully"})
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
        let chapter = await chapterV2Model.findOne({ _id: data, isDeleted: false })

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
      chapters = await chapterV2Model
        .find({
          courseId: courseId,
          isDeleted: false,
        })
        .skip(newpageno * pCount)
        .limit(pCount);
    } else {
      chapters = await chapterV2Model
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

    const chaptersall = await chapterV2Model
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

// Get Assigned Chapters

const getAssignedByCourseId = async function (req, res) {
  let courseId = req.body.courseId;
  if (!isValidObjectId(courseId)) {
    return res
      .status(400)
      .send({ status: false, message: "Please enter a valid courseId" });
  }

  const findCourse = await courseModel.findOne({
    _id: courseId,
    isDeleted: false,
  });

  if (!findCourse) {
    return res.status(404).send({ status: false, message: "No Course found" });
  }

  try {
    let chapters = await chapterV2Model
      .find({
        isDeleted: false,
      })
      .select({ chapter_name: 1, image: 1 })
      .lean();

    let assignedCourses = await courseSubjectModel
      .find({
        courseId: courseId,
        removeStatus: false,
        isDeleted: false,
      })
      .select({ chapterId: 1, _id: 0 })
      .populate("chapterId", ["chapter_name", "image"])
      .lean();
    
      let newAssignedArr = [];

      for(let i = 0; i < assignedCourses.length; i++){
        newAssignedArr.push({
          _id: assignedCourses[i].chapterId._id,
          chapter_name: assignedCourses[i].chapterId.chapter_name,
          image: assignedCourses[i].chapterId.image,
        });
      }

       let newFinalArr = [];
       
       for (var i = 0; i < newAssignedArr.length; i++) {
        for (var j = 0; j < chapters.length; j++) {
          if(newAssignedArr[i]._id.toString()==chapters[j]._id.toString()){
            chapters.splice(j, 1);
            j--;
          }
        }
     }

    res.status(200).send({ status: true, data: chapters });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// Get Removed Chapters

const getRemovedByCourseId = async function (req, res) {
   let courseId = req.body.courseId;
   if (!isValidObjectId(courseId)) {
     return res
       .status(400)
       .send({ status: false, message: "Please enter a valid courseId" });
   }

   const findCourse = await courseModel.findOne({
     _id: courseId,
     isDeleted: false,
   });

   if (!findCourse) {
     return res.status(404).send({ status: false, message: "No Course found" });
   }
   
  try {
  let assignedCourses = await courseSubjectModel
    .find({
      courseId: courseId,
      removeStatus: false,
      isDeleted: false,
    })
    .select({ chapterId: 1, _id: 1 }).sort({sequence: 1})
    .populate("chapterId", ["chapter_name", "image"])
    .lean();

  let newAssignedArr = [];

  for (let i = 0; i < assignedCourses.length; i++) {
    newAssignedArr.push({
      _id: assignedCourses[i].chapterId._id,
      courseSubjectId: assignedCourses[i]._id,
      chapter_name: assignedCourses[i].chapterId.chapter_name,
      image: assignedCourses[i].chapterId.image,
    });
  }

    res.status(200).send({ status: true, data: newAssignedArr });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// Search chapter

const getAllSearch = async function (req, res) {
  try {
    const search_query = req.body.query;
    const chaptersall = await chapterV2Model
      .find({
        chapter_name: { $regex: new RegExp(search_query, "i") },
        isDeleted: false,
      }).select({chapter_name: 1});

  

    res.status(200).send({ status: true, data: chaptersall });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

  
// Get chapter v2

const getchapterV2 = async function (req, res) {
  try {
    const pageno = req.body.pageno;
    const newpageno = pageno - 1;
    const pCount = 10;
    const ispage = req.body.isPagination;
    let chapters = [];

    if (ispage == 1) {
      chapters = await chapterV2Model
        .find({
          isDeleted: false,
        })
        .skip(newpageno * pCount)
        .limit(pCount);
    } else {
      chapters = await chapterV2Model
        .find({
          isDeleted: false,
        });
    }

    

    const chaptersall = await chapterV2Model
      .find({
        isDeleted: false,
      });
    const chapter_count = Math.ceil(chaptersall.length / pCount);

    const chapterIds = chapters.map((chapter) => chapter._id);
    // const quizCounts = await quizModel.aggregate([
    //   { $match: { chapterId: { $in: chapterIds } } },
    //   { $group: { _id: "$chapterId", count: { $sum: 1 } } },
    // ]);

    const chaptersWithCount = await Promise.all(
      chapters.map(async (chapter) => {
        const quizCount = await mockSubjectModel.countDocuments({ chapterId: chapter._id, isDeleted: false });

        return {
          _id: chapter._id,
          chapter_name: chapter.chapter_name,
          image: chapter.image,
          status: chapter.status,
          isDeleted: chapter.isDeleted,
          createdAt: chapter.createdAt,
          updatedAt: chapter.updatedAt,
          __v: chapter.__v,
          quiz_count: quizCount,
        };
      })
  );

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
        const chapters = await courseSubjectModel.find({ courseId: course._id, isDeleted: false}).select({courseId:1, chapterId:1,}).populate("chapterId",["chapter_name","chapter_slug","chapter_desc","image","showCase"]);

        res.status(200).send({ status: true, data: chapters, course_name: course.course_title });
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
    
    const updatedCategory = await chapterV2Model.updateMany({}, category, { new: true });

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

    const { chapter_id, chapter_desc, chapter_name, chapter_admin_name, showCase } = req.body;

    const data = {
        chapter_name,
        chapter_admin_name,
        chapter_desc,
        chapter_slug: `${slugify(req.body.chapter_name)}`,
        showCase,
    }
    
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'mankantlaweducation/addchapter' });
        data.image = result.secure_url;

    }
    
    const updatedData = await chapterV2Model.findOneAndUpdate({ _id: chapter_id }, data, { new: true });
    return res.status(201).json({ updatedData: updatedData });
}

//------------------------------------ Delete Chapter ----------------------------------


 

  const deleteChapter = async (req, res) => {
    try {
      const id = req.body.subjectId;
  
      if (!isValidObjectId(id)) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter a valid id" });
      }
  
      const findChapter = await chapterV2Model.findOne({
        _id: id,
        isDeleted: false,
      });
  
      if (!findChapter) {
        return res
          .status(404)
          .send({ status: false, message: "No chapter found" });
      }
  
      const notesCount = await noteSubjectModel.countDocuments({
        subjectId: id,
        isDeleted: false,
      });
  
      if (notesCount > 0) {
        return res.status(400).send({
          status: false,
          message: "Please First delete notes",
        });
      }
  
      await chapterV2Model.findOneAndUpdate(
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

  const getCoursesByChapterId = async (req, res) => {
    try {
        const chapterId = req.body.chapterId

        if (!isValidObjectId(chapterId)) {
            return res.status(400).send({ status: false, message: "Invaild chapter Id" })
        }
        //find the chapterId which is deleted key is false--
        let chapter = await chapterV2Model.findOne({ _id: chapterId, isDeleted: false })

        if (!chapter) {
            return res.status(404).send({ status: false, message: "No chapters Available!!" })
        }

    let assignedCourses = await courseSubjectModel
      .find({
        chapterId: chapterId,
        removeStatus: false,
        isDeleted: false,
      })
      .select({ courseId: 1, _id: 0 })
      .populate("courseId", ["course_title"])
      .lean();

        return res.status(200).send({ status: true, message: 'Success', data: assignedCourses })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}
  

module.exports = {chapterAdd,deleteChapter,getchapterById,getBySlug ,getchapter, getAssignedByCourseId, getRemovedByCourseId, getchapterV2, getCoursesByChapterId, getAllSearch, updatechapter, updateManyShowCase}