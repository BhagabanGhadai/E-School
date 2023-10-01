const chapterModel = require('../models/chapterModel')
const courseModel = require('../models/courseModel')
const notesV2Model = require('../models/notesV2Model')
const noteSubjectModel = require('../models/noteSubjectModel')
const mockSubjectModel = require('../models/mockSubjectModel')

const chapterV2Model = require('../models/chapterV2Model')


const cloudinary = require("../utils/cloudinary");
const { isRequired, isInvalid, isValid} = require("../utils/chapterValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')
const request = require('request');
const axios = require('axios');
const moment = require('moment');


const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



// //------------------------------------------------- API-1 [/Add Notes] --------------------------------------------------//

const notesAdd= async function (req, res) {
   
    try {
        let data = req.body
        let pdf= req.pdf


        let error = []
        let err1 = isRequired(data, pdf)
        if (err1)
            error.push(...err1)

        let err2 = isInvalid(data, pdf)
        if (err2)
            error.push(...err2)

        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "mankantlaweducation/addnotes",
              });
              data.pdf= result.secure_url;
              data.notes_slug= slugify(req.body.notes_name);
      
        let created = await notesV2Model.create(data)
        res.status(201).send({ status: true, message: "notes created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================================== Get Notes ===================================================================//
const getnotesById = async (req, res) => {
    try {
        const data = req.body.notesId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild notes Id" })
        }
        //find the notesId which is deleted key is false--
        let notes = await notesV2Model.findOne({ _id: data, isDeleted: false })

        if (!notes) {
            return res.status(404).send({ status: false, message: "No notes Available!!" })
        }
        return res.status(200).send({ status: true, count: notes.length, message: 'Success', data: notes })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get Notes ===================================================================//
const getnotesBySubjectId = async (req, res) => {
    
    try {
        const subjectId = req.body.subjectId

        if (!isValidObjectId(subjectId)) {
            return res.status(400).send({ status: false, message: "Invaild Subject Id" })
        }
        //find the notesId which is deleted key is false--
        let notes = await noteSubjectModel.find({ subjectId: subjectId, removeStatus: false, isDeleted: false}).select({"notesId" : 1}).populate('notesId',["notes_name","notes_slug","pdf"]);
        

        if (notes.length == 0) {
            return res.status(404).send({ status: false, message: "No notes Available!!" })
        }
        return res.status(200).send({ status: true, count: notes.length, message: 'Success', data: notes })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get Notes ===================================================================//
const getsubjectsByNotesId = async (req, res) => {
    
  try {
      const notesId = req.body.notesId

      if (!isValidObjectId(notesId)) {
          return res.status(400).send({ status: false, message: "Invaild Subject Id" })
      }
      //find the notesId which is deleted key is false--
      let subjects = await noteSubjectModel.find({ notesId: notesId, removeStatus: false, isDeleted: false}).select({"subjectId" : 1}).populate('subjectId',["chapter_name"]);
      

      if (subjects.length == 0) {
          return res.status(404).send({ status: false, message: "No subjects Available!!" })
      }
      return res.status(200).send({ status: true, count: subjects.length, message: 'Success', data: subjects })
  }
  catch (error) {
      res.status(500).send({ Error: error.message })
  }
}

//====================================================== Get Notes ===================================================================//
const getAssignedNotesBySubjectId = async (req, res) => {
    
    try {
        const subjectId = req.body.subjectId

        if (!isValidObjectId(subjectId)) {
            return res.status(400).send({ status: false, message: "Invaild notes Id" })
        }
        const findSubject = await chapterV2Model.findOne({
            _id: subjectId,
            isDeleted: false,
          });
        
          if (!findSubject) {
            return res.status(404).send({ status: false, message: "No Subject found" });
          }

          let notesAll = await notesV2Model
          .find({
            isDeleted: false,
          })
          .select({ notes_name: 1, pdf: 1 })
          .lean();

        //find the notesId which is deleted key is false--
        let assignedNotes = await noteSubjectModel.find({ subjectId: subjectId, removeStatus: false, isDeleted: false}).select({"notesId" : 1}).populate('notesId',["notes_name","pdf"]);

        let newAssignedArr = [];

      for(let i = 0; i < assignedNotes.length; i++){
        newAssignedArr.push({
          _id: assignedNotes[i].notesId._id,
          notes_name: assignedNotes[i].notesId.notes_name,
          pdf: assignedNotes[i].notesId.pdf,
        });
      }

       
       for (var i = 0; i < newAssignedArr.length; i++) {
        for (var j = 0; j < notesAll.length; j++) {
          if(newAssignedArr[i]._id.toString()==notesAll[j]._id.toString()){
            notesAll.splice(j, 1);
            j--;
          }
        }
     }

      

        if (notesAll.length == 0) {
            return res.status(404).send({ status: false, message: "No notes Available!!" })
        }
        return res.status(200).send({ status: true, count: notesAll.length, message: 'Success', data: notesAll })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//get Assigned mocks

const getAssignedMocksBySubjectId = async (req, res) => {
    
    try {
        const subjectId = req.body.subjectId;
        let mocksAll;

        if (!isValidObjectId(subjectId)) {
            return res.status(400).send({ status: false, message: "Invaild notes Id" })
        }
        const findSubject = await chapterV2Model.findOne({
            _id: subjectId,
            isDeleted: false,
          });
        
          if (!findSubject) {
            return res.status(404).send({ status: false, message: "No Subject found" });
          }

          const response = await axios.get('https://quiz-microservice-r6u8g.ondigitalocean.app/api/quiz/list?published=true');

          let notesAll = response.data.data[0].records;

        //find the notesId which is deleted key is false--
        let assignedMock = await mockSubjectModel.find({ subjectId: subjectId, removeStatus: false, isDeleted: false}).select({"mockId" : 1});

        
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

//====================================================== Get Notes ===================================================================//
const getRemovedNotesBySubjectId = async (req, res) => {
    
    try {
        const subjectId = req.body.subjectId

        if (!isValidObjectId(subjectId)) {
            return res.status(400).send({ status: false, message: "Invaild notes Id" })
        }
        //find the notesId which is deleted key is false--
        let notes = await noteSubjectModel.find({ subjectId: subjectId, removeStatus: false, isDeleted: false}).select({"notesId" : 1}).sort({sequence: 1}).populate('notesId',["notes_name","notes_slug","pdf"]);
        

        if (notes.length == 0) {
            return res.status(404).send({ status: false, message: "No notes Available!!" })
        }
        return res.status(200).send({ status: true, count: notes.length, message: 'Success', data: notes })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

// Get Removed mocks

const getRemovedMocksBySubjectId = async (req, res) => {
    
  try {
    const subjectId = req.body.subjectId;
    let mocksAll;

    if (!isValidObjectId(subjectId)) {
        return res.status(400).send({ status: false, message: "Invaild notes Id" })
    }
    const findSubject = await chapterV2Model.findOne({
        _id: subjectId,
        isDeleted: false,
      });
    
      if (!findSubject) {
        return res.status(404).send({ status: false, message: "No Subject found" });
      }

      const response = await axios.get('https://quiz-microservice-r6u8g.ondigitalocean.app/api/quiz/list?published=true');

      let notesAll = response.data.data[0].records;

    //find the notesId which is deleted key is false--
    let assignedMock = await mockSubjectModel.find({ subjectId: subjectId, removeStatus: false, isDeleted: false}).select({"mockId" : 1});

    
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

//====================================================== Get All Notes ===================================================================//

const getAllnotes = async function (req, res) {
    try {
        let notes; 
        notes =  await notesV2Model.find({ isDeleted: false});
        const coursesWithCount = await Promise.all(
          notes.map(async (note) => {
            let subjects = await noteSubjectModel.find({ notesId: note._id, removeStatus: false, isDeleted: false}).select({"subjectId" : 1}).populate('subjectId',["chapter_name"]);
              return {
                  _id: note._id,
                  notes_name: note.notes_name,
                  pdf: note.pdf,
                  subjects,
                  date_created: moment(note.createdAt).format('YYYY-MM-DD HH:mm:ss')
              };
          })
      );

        res.status(200).send({status:true, data: coursesWithCount})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

// Search Notes v2

const getAllSearch = async function (req, res) {
    try {
        const search_query = req.body.query;
        const notesAll = await notesV2Model
          .find({
            notes_name: { $regex: new RegExp(search_query, "i") },
            isDeleted: false,
          }).select({notes_name: 1});
    
        res.status(200).send({ status: true, data: notesAll });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}



// //--------------------------------------------------------- Update Notes -------------------------------------------------------//


const updateNotes = async (req, res) => {

  const { notesId } = req.body;

    const data = {
          notes_name:req.body.notes_name,
        notes_slug: `${slugify(req.body.notes_name)}`,
    }
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'mankantlaweducation/addnotes' });
        data.pdf = result.secure_url;

    }
    
    const updatedData = await notesV2Model.findOneAndUpdate({ _id: notesId }, data, { new: true });
    return res.status(201).json({ updatedData:updatedData });
}
//------------------------------------ Delete Notes ----------------------------------

const deleteNotes= async (req, res) => {

    try {
      let id = req.body.notesId
  
  
  //check wheather objectId is valid or not--
      if (!isValidObjectId(id)) {
  
        return res.status(400).send({ status: false, message: "please enter valid id" })
      }
  
      const findnotes = await notesV2Model.findOne({ _id: id, isDeleted: false })
  
  
      if (!findnotes) {
        return res.status(404).send({ status: false, message: 'No notes found' })
      }
  
      await notesV2Model.findOneAndUpdate({ _id: id },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true })
      return res.status(200).send({ status: true, message: "deleted sucessfully" })
    }
    catch (err) {
      console.log(err.message)
      return res.status(500).send({ status: "error", msg: err.message })
    }
  }

module.exports = {notesAdd,getnotesById,getnotesBySubjectId,getsubjectsByNotesId,getAssignedNotesBySubjectId,getAssignedMocksBySubjectId,getRemovedNotesBySubjectId,getRemovedMocksBySubjectId,getAllnotes,getAllSearch,updateNotes,deleteNotes}

