const chapterModel = require('../models/chapterModel')
const courseModel = require('../models/courseModel')
const notesModel = require('../models/notesModel')



const cloudinary = require("../utils/cloudinary");
const { isRequired, isInvalid, isValid} = require("../utils/chapterValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}



// //------------------------------------------------- API-1 [/Add Notes] --------------------------------------------------//

const notesAdd= async function (req, res) {
   
    try {
        let data = req.body
        let chapterId = req.body.chapterId
        let pdf= req.pdf

        if (!isValidObjectId(chapterId)) {
            return res.status(400).send({ status: false, message: "plz enter valid chapterId" })
        }


        let check = await chapterModel.findOne({ _id:chapterId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "chapter does'nt exist" })
        }
      
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
      
           
      

        let created = await notesModel.create(data)
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
        let notes = await notesModel.findOne({ _id: data, isDeleted: false })

        if (!notes) {
            return res.status(404).send({ status: false, message: "No notes Available!!" })
        }
        return res.status(200).send({ status: true, count: notes.length, message: 'Success', data: notes })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get All Notes ===================================================================//

const getAllnotes = async function (req, res) {
    try {

        const data = req.body.chapterId;
        const pageno = req.body.pageno;
        const newpageno = pageno-1;
        const pCount = 10;
        const ispage = req.body.isPagination;

        let notes; 

        if(ispage == 1){
            notes =  await notesModel
            .find({ isDeleted: false, chapterId: data })
            .skip(newpageno * pCount)
            .limit(pCount);
        } else {
            notes =  await notesModel
            .find({ isDeleted: false, chapterId: data });
        }

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild chapterId" })
        }
       
        

        let notesAll = await notesModel
          .find({ isDeleted: false, chapterId: data });
        let notes_count = Math.ceil(notesAll.length/pCount);

        res.status(200).send({status:true, data: notes, notes_count,isPagination:1})
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
    
    const updatedData = await notesModel.findOneAndUpdate({ _id: notesId }, data, { new: true });
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
  
      const findnotes = await notesModel.findOne({ _id: id, isDeleted: false })
  
  
      if (!findnotes) {
        return res.status(404).send({ status: false, message: 'No notes found' })
      }
  
      await notesModel.findOneAndUpdate({ _id: id },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true })
      return res.status(200).send({ status: true, message: "deleted sucessfully" })
    }
    catch (err) {
      console.log(err.message)
      return res.status(500).send({ status: "error", msg: err.message })
    }
  }

module.exports = {notesAdd,getnotesById,getAllnotes,updateNotes,deleteNotes}

