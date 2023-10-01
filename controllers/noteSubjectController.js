const chapterV2Model = require('../models/chapterV2Model')
const noteSubjectModel = require('../models/noteSubjectModel')

const cloudinary = require("../utils/cloudinary");
const { isRequired, isInvalid, isValid} = require("../utils/chapterValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



// //----------------------------------- API-1 [/Add Course Subject]---------------------------//

const addNoteSubject= async function (req, res) {
   
    try {
        
        let noteIds = req.body.noteIds
        let subjectId = req.body.subjectId


        if (!isValidObjectId(subjectId)) {
            return res.status(400).send({ status: false, message: "plz enter valid subjectId" })
        }

        let checkSubject = await chapterV2Model.findOne({ _id:subjectId, isDeleted: false }).lean()
        if (!checkSubject) {
            return res.status(404).send({ status: false, message: "Course does not exist" })
        }
        

        for(let i = 0; i < noteIds.length; i++){
            let data = {
                notesId: noteIds[i],
                subjectId: subjectId,
                sequence: i+1
            }

             let checkCourseSubject = await noteSubjectModel
               .findOne({ notesId: noteIds[i], subjectId: subjectId })
               .lean();
             if (!checkCourseSubject) {
                let created = await noteSubjectModel.create(data);
                    
             }else{
                
                let checkNewSubject = await noteSubjectModel
               .findOne({ notesId: noteIds[i], subjectId: subjectId })
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
    
                let updatedData = await noteSubjectModel.findOneAndUpdate(
                  { notesId: noteIds[i], subjectId: subjectId },
                  data,
                  { new: true }
                );
             }

        }

        res.status(201).send({ status: true, message: "Notes added to Subject Successfully" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

// //----------------------------------- API-1 [/Remove Course Subject]---------------------------//

const removeNoteSubject= async function (req, res) {
   
    try {
        
        let noteIds = req.body.noteIds
        let subjectId = req.body.subjectId


        if (!isValidObjectId(subjectId)) {
            return res.status(400).send({ status: false, message: "plz enter valid subjectId" })
        }

        let checkCourse = await chapterV2Model.findOne({ _id:subjectId, isDeleted: false }).lean()
        if (!checkCourse) {
            return res.status(404).send({ status: false, message: "Course does not exist" })
        }

        for(let i = 0; i < noteIds.length; i++){

            let data = {
                removeStatus: true
            }

            let updatedData = await noteSubjectModel.findOneAndUpdate(
              { notesId: noteIds[i], subjectId: subjectId, removeStatus: false },
              data,
              { new: true }
            );

        }

        res.status(201).send({ status: true, message: "Notes removed from Subject Successfully" })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
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
//         let notes = await noteSubjectModel.findOne({ _id: data, isDeleted: false })

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
//             notes =  await noteSubjectModel
//             .find({ isDeleted: false, chapterId: data })
//             .skip(newpageno * pCount)
//             .limit(pCount);
//         } else {
//             notes =  await noteSubjectModel
//             .find({ isDeleted: false, chapterId: data });
//         }

//         if (!isValidObjectId(data)) {
//             return res.status(400).send({ status: false, message: "Invaild chapterId" })
//         }
       
        

//         let notesAll = await noteSubjectModel
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
    
//     const updatedData = await noteSubjectModel.findOneAndUpdate({ _id: notesId }, data, { new: true });
//     return res.status(201).json({ updatedData:updatedData });
// }
//------------------------------------ Delete Notes ----------------------------------

// const deleteNotes= async (req, res) => {

//     try {
//       let id = req.body.notesId
  
  
//       if (!isValidObjectId(id)) {
  
//         return res.status(400).send({ status: false, message: "please enter valid id" })
//       }
  
//       const findnotes = await noteSubjectModel.findOne({ _id: id, isDeleted: false })
  
  
//       if (!findnotes) {
//         return res.status(404).send({ status: false, message: 'No notes found' })
//       }
  
//       await noteSubjectModel.findOneAndUpdate({ _id: id },
//         { $set: { isDeleted: true, deletedAt: Date.now() } },
//         { new: true })
//       return res.status(200).send({ status: true, message: "deleted sucessfully" })
//     }
//     catch (err) {
//       console.log(err.message)
//       return res.status(500).send({ status: "error", msg: err.message })
//     }
//   }

const updateNoteSequence = async function (req, res) {
  try {
    let noteSubjectId = req.body.noteSubjectId;
    let subjectId = req.body.subjectId;
    let sequence_status = req.body.sequence_status;
    let updatedCurrentData;
    let updatedPrevData;
    let getNote;
    let data;
    let prevData;

    let checkNote = await noteSubjectModel
      .findOne({ _id: noteSubjectId, removeStatus: false, isDeleted: false })
      .lean();
    if (!checkNote) {
      return res
        .status(404)
        .send({ status: false, message: "No notes assigned with this Id" });
    }

    if(sequence_status == 1){
        getNote = await noteSubjectModel
          .findOne({
            subjectId: subjectId,
            sequence: checkNote.sequence + 1,
            removeStatus: false,
            isDeleted: false,
          })
          .lean();
        if (!getNote) {
          return res
            .status(404)
            .send({ status: false, message: "Note does not assigned" });
        }

        data = {
          sequence: checkNote.sequence + 1,
        };

        updatedCurrentData = await noteSubjectModel.findOneAndUpdate(
          { _id: noteSubjectId, removeStatus: false, isDeleted: false },
          data,
          { new: true }
        );

        prevData = {
          sequence: getNote.sequence - 1,
        };

         updatedPrevData = await noteSubjectModel.findOneAndUpdate(
          {
            _id: getNote._id,
            removeStatus: false,
            isDeleted: false,
          },
          prevData,
          { new: true }
        );

    }

    if (sequence_status == 0) {
      getNote = await noteSubjectModel
        .findOne({
          subjectId: subjectId,
          sequence: checkNote.sequence - 1,
          removeStatus: false,
          isDeleted: false,
        })
        .lean();
      if (!getNote) {
        return res
          .status(404)
          .send({ status: false, message: "Note does not assigned" });
      }

      data = {
        sequence: checkNote.sequence - 1,
      };

      updatedCurrentData = await noteSubjectModel.findOneAndUpdate(
        { _id: noteSubjectId, removeStatus: false, isDeleted: false },
        data,
        { new: true }
      );

      prevData = {
        sequence: getNote.sequence + 1,
      };

      updatedPrevData = await noteSubjectModel.findOneAndUpdate(
        {
          _id: getNote._id,
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
        message: "Notes sequence updated Successfully",
      });
    }

    
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = { addNoteSubject, removeNoteSubject, updateNoteSequence };

