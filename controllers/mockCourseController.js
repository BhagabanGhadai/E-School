const courseModel = require('../models/courseModel')
const mockCourseModel = require('../models/mockCourseModel')

const cloudinary = require("../utils/cloudinary");
const { isRequired, isInvalid, isValid} = require("../utils/chapterValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')
const axios = require('axios');

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



// //----------------------------------- API-1 [/Add Course Subject]---------------------------//

const addMockCourse= async function (req, res) {
   
    try {
        
        let mockIds = req.body.mockIds
        let courseId = req.body.courseId


        if (!isValidObjectId(courseId)) {
            return res.status(400).send({ status: false, message: "plz enter valid courseId" })
        }

        let checkCourse = await courseModel.findOne({ _id:courseId, isDeleted: false }).lean()
        if (!checkCourse) {
            return res.status(404).send({ status: false, message: "Course does not exist" })
        }
        

        for(let i = 0; i < mockIds.length; i++){
            let data = {
              mockId: mockIds[i],
              courseId: courseId,
              sequence: i + 1
            };

             let checkCourseSubject = await mockCourseModel
               .findOne({ mockId: mockIds[i], courseId: courseId })
               .lean();
             if (!checkCourseSubject) {
                let created = await mockCourseModel.create(data);
                    
             }else{
                
                let checkNewSubject = await mockCourseModel
               .findOne({ mockId: mockIds[i], courseId: courseId })
               .lean();

                let data;

                if(checkNewSubject.removeStatus == true){
                    data = {
                        removeStatus: false
                    }
                }else{
                    data = {
                        removeStatus: true
                    } 
                }
    
                let updatedData = await mockCourseModel.findOneAndUpdate(
                  { mockId: mockIds[i], courseId: courseId },
                  data,
                  { new: true }
                );
             }

        }

        res.status(201).send({ status: true, message: "Mocks added to Course Successfully" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// //----------------------------------- API-1 [/Remove Course Subject]---------------------------//

const removeMockCourse= async function (req, res) {
   
    try {
        
        let mockIds = req.body.mockIds
        let courseId = req.body.courseId


        if (!isValidObjectId(courseId)) {
            return res.status(400).send({ status: false, message: "plz enter valid courseId" })
        }

        let checkCourse = await courseModel.findOne({ _id:courseId, isDeleted: false }).lean()
        if (!checkCourse) {
            return res.status(404).send({ status: false, message: "Subject does not exist" })
        }

        for(let i = 0; i < mockIds.length; i++){

            let data = {
                removeStatus: true
            }

            let updatedData = await mockCourseModel.findOneAndUpdate(
              { mockId: mockIds[i], courseId: courseId, removeStatus: false },
              data,
              { new: true }
            );

        }

        res.status(201).send({ status: true, message: "Mocks removed from Course Successfully" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// Get assigned Mocks by CourseId

const getAssignedMocksByCourseId = async (req, res) => {
    
    try {
        const courseId = req.body.courseId;
        
        let mocksAll;

        if (!isValidObjectId(courseId)) {
            return res.status(400).send({ status: false, message: "Invaild notes Id" })
        }
        const findSubject = await courseModel.findOne({
            _id: courseId,
            isDeleted: false,
          });
        
          if (!findSubject) {
            return res.status(404).send({ status: false, message: "No Course found" });
          }

          const response = await axios.get('https://quiz-microservice-r6u8g.ondigitalocean.app/api/quiz/list?published=true');

          let notesAll = response.data.data[0].records;

         

        //find the notesId which is deleted key is false--
        let assignedMock = await mockCourseModel.find({ courseId: courseId, removeStatus: false, isDeleted: false}).select({"mockId" : 1});

        
        let newQuizArr = [];

        for(let i = 0; i < notesAll.length; i++){
            newQuizArr.push({
              _id: notesAll[i]._id,
              title: notesAll[i].title,
            });
          }

        

        let newAssignedArr = [];

      for(let i = 0; i < assignedMock.length; i++){
        newAssignedArr.push({
          _id: assignedMock[i].mockId.toString(),
        //   notes_name: assignedMock[i].notesId.notes_name,
        });
      }


        let finalAssignedArr = [];

       for (var i = 0; i < newAssignedArr.length; i++) {
        for (var j = 0; j < newQuizArr.length; j++) {
          if(newAssignedArr[i]._id.toString()==newQuizArr[j]._id.toString()){
            finalAssignedArr.push({
                _id: newQuizArr[j]._id,
                title: newQuizArr[j].title,
              });
          }
        }
     }

      

        if (finalAssignedArr.length == 0) {
            return res.status(404).send({ status: false, message: "No notes Available!!" })
        }
        return res.status(200).send({ status: true, count: finalAssignedArr.length, message: 'Success', data: finalAssignedArr })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

// Get Removed Mocks by CourseId
const getRemovedMocksByCourseId = async (req, res) => {
    
    try {
      const courseId = req.body.courseId;
      let mocksAll;
  
      if (!isValidObjectId(courseId)) {
          return res.status(400).send({ status: false, message: "Invaild notes Id" })
      }
      const findSubject = await courseModel.findOne({
          _id: courseId,
          isDeleted: false,
        });
      
        if (!findSubject) {
          return res.status(404).send({ status: false, message: "No Subject found" });
        }
  
        const response = await axios.get('https://quiz-microservice-r6u8g.ondigitalocean.app/api/quiz/list?published=true');
  
        let notesAll = response.data.data[0].records;
  
      //find the notesId which is deleted key is false--
      let assignedMock = await mockCourseModel.find({ courseId: courseId, removeStatus: false, isDeleted: false}).select({"mockId" : 1});
  
      
      let newQuizArr = [];
  
      for(let i = 0; i < notesAll.length; i++){
          newQuizArr.push({
            _id: notesAll[i]._id,
            title: notesAll[i].title,
          });
        }
  
      
  
      let newAssignedArr = [];
  
    for(let i = 0; i < assignedMock.length; i++){
      newAssignedArr.push({
        _id: assignedMock[i].mockId.toString(),
      //   notes_name: assignedMock[i].notesId.notes_name,
      });
    }
  
  
      let finalAssignedArr = [];
  
      for (var i = 0; i < newAssignedArr.length; i++) {
        for (var j = 0; j < newQuizArr.length; j++) {
          if(newAssignedArr[i]._id.toString()==newQuizArr[j]._id.toString()){
            newQuizArr.splice(j, 1);
            j--;
          }
        }
     }
  
  //    for (var i = 0; i < newAssignedArr.length; i++) {
  //     for (var j = 0; j < newQuizArr.length; j++) {
  //       if(newAssignedArr[i]._id.toString()==newQuizArr[j]._id.toString()){
  //         finalAssignedArr.push({
  //             _id: newQuizArr[i]._id,
  //             title: newQuizArr[i].title,
  //           });
          
  //       }
  //     }
  //  }
  
    
  
      if (newQuizArr.length == 0) {
          return res.status(404).send({ status: false, message: "No notes Available!!" })
      }
      return res.status(200).send({ status: true, count: newQuizArr.length, message: 'Success', data: newQuizArr })
  }
  catch (error) {
      res.status(500).send({ Error: error.message })
  }
  }


//=================================== Get Course Subject ==================================================//
// const getnotesById = async (req, res) => {
//     try {
//         const data = req.body.notesId

//         if (!isValidObjectId(data)) {
//             return res.status(400).send({ status: false, message: "Invaild notes Id" })
//         }
//         //find the notesId which is deleted key is false--
//         let notes = await mockCourseModel.findOne({ _id: data, isDeleted: false })

//         if (!notes) {
//             return res.status(404).send({ status: false, message: "No notes Available!!" })
//         }
//         return res.status(200).send({ status: true, count: notes.length, message: 'Success', data: notes })
//     }
//     catch (error) {
//         res.status(500).send({ Error: error.message })
//     }
// }

//====================================================== Get All Notes ===================================================================//

// const getAllnotes = async function (req, res) {
//     try {

//         const data = req.body.chapterId;
//         const pageno = req.body.pageno;
//         const newpageno = pageno-1;
//         const pCount = 10;
//         const ispage = req.body.isPagination;

//         let notes; 

//         if(ispage == 1){
//             notes =  await mockCourseModel
//             .find({ isDeleted: false, chapterId: data })
//             .skip(newpageno * pCount)
//             .limit(pCount);
//         } else {
//             notes =  await mockCourseModel
//             .find({ isDeleted: false, chapterId: data });
//         }

//         if (!isValidObjectId(data)) {
//             return res.status(400).send({ status: false, message: "Invaild chapterId" })
//         }
       
        

//         let notesAll = await mockCourseModel
//           .find({ isDeleted: false, chapterId: data });
//         let notes_count = Math.ceil(notesAll.length/pCount);

//         res.status(200).send({status:true, data: notes, notes_count,isPagination:1})
//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message });
//     }
// }



// //--------------------------------------------------------- Update Notes -------------------------------------------------------//


// const updateNotes = async (req, res) => {

//   const { notesId } = req.body;

//     const data = {
//           notes_name:req.body.notes_name,
//         notes_slug: `${slugify(req.body.notes_name)}`,
//     }
//     if (req.file) {
//         const result = await cloudinary.uploader.upload(req.file.path, { folder: 'mankantlaweducation/addnotes' });
//         data.pdf = result.secure_url;

//     }
    
//     const updatedData = await mockCourseModel.findOneAndUpdate({ _id: notesId }, data, { new: true });
//     return res.status(201).json({ updatedData:updatedData });
// }
//------------------------------------ Delete Notes ----------------------------------

// const deleteNotes= async (req, res) => {

//     try {
//       let id = req.body.notesId
  
  
//       if (!isValidObjectId(id)) {
  
//         return res.status(400).send({ status: false, message: "please enter valid id" })
//       }
  
//       const findnotes = await mockCourseModel.findOne({ _id: id, isDeleted: false })
  
  
//       if (!findnotes) {
//         return res.status(404).send({ status: false, message: 'No notes found' })
//       }
  
//       await mockCourseModel.findOneAndUpdate({ _id: id },
//         { $set: { isDeleted: true, deletedAt: Date.now() } },
//         { new: true })
//       return res.status(200).send({ status: true, message: "deleted sucessfully" })
//     }
//     catch (err) {
//       console.log(err.message)
//       return res.status(500).send({ status: "error", msg: err.message })
//     }
//   }

const updateMockSequence = async function (req, res) {
  try {
    let mockCourseId = req.body.mockCourseId;
    let courseId = req.body.courseId;
    let sequence_status = req.body.sequence_status;
    let updatedCurrentData;
    let updatedPrevData;
    let getMock;
    let data;
    let prevData;

    let checkMock = await mockCourseModel
      .findOne({ _id: mockCourseId, removeStatus: false, isDeleted: false })
      .lean();
    if (!checkMock) {
      return res
        .status(404)
        .send({ status: false, message: "No notes assigned with this Id" });
    }

    if(sequence_status == 1){
        getMock = await mockCourseModel
          .findOne({
            courseId: courseId,
            sequence: checkMock.sequence + 1,
            removeStatus: false,
            isDeleted: false,
          })
          .lean();
        if (!getMock) {
          return res
            .status(404)
            .send({ status: false, message: "Note does not assigned" });
        }

        data = {
          sequence: checkMock.sequence + 1,
        };

        updatedCurrentData = await mockCourseModel.findOneAndUpdate(
          { _id: mockCourseId, removeStatus: false, isDeleted: false },
          data,
          { new: true }
        );

        prevData = {
          sequence: getMock.sequence - 1,
        };

         updatedPrevData = await mockCourseModel.findOneAndUpdate(
          {
            _id: getMock._id,
            removeStatus: false,
            isDeleted: false,
          },
          prevData,
          { new: true }
        );

    }

    if (sequence_status == 0) {
      getMock = await mockCourseModel
        .findOne({
          courseId: courseId,
          sequence: checkMock.sequence - 1,
          removeStatus: false,
          isDeleted: false,
        })
        .lean();
      if (!getMock) {
        return res
          .status(404)
          .send({ status: false, message: "Note does not assigned" });
      }

      data = {
        sequence: checkMock.sequence - 1,
      };

      updatedCurrentData = await mockCourseModel.findOneAndUpdate(
        { _id: mockCourseId, removeStatus: false, isDeleted: false },
        data,
        { new: true }
      );

      prevData = {
        sequence: getMock.sequence + 1,
      };

      updatedPrevData = await mockCourseModel.findOneAndUpdate(
        {
          _id: getMock._id,
          removeStatus: false,
          isDeleted: false,
        },
        prevData,
        { new: true }
      );
    }

    if(updatedCurrentData && updatedPrevData){
      res.status(201).send({
        status: true,
        message: "Mocks sequence updated Successfully",
      });
    }

    
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = {addMockCourse, removeMockCourse, updateMockSequence, getAssignedMocksByCourseId, getRemovedMocksByCourseId}

