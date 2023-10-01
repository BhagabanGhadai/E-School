const facultyModel = require('../models/facultyModel')
const facultyDegreeModel = require('../models/facultyDegreeModel')

const courseModel = require('../models/courseModel')


const cloudinary = require("../utils/cloudinary");
const { isRequired, isInvalid, isValid} = require("../utils/facultyValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}






// //------------------------------------------------- API-1 [/Add faculty] --------------------------------------------------//

const facultyAdd= async function (req, res) {
   
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
                folder: "mankantlaweducation/faculty",
              });
              data.image= result.secure_url;
        let created = await facultyModel.create(data)
        res.status(201).send({ status: true, message: "faculty created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//====================================================== Get faculty ===================================================================//
const getfacultyById = async (req, res) => {
    try {
        const data = req.body.facultyId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild faculty Id" })
        }
        //find the facultyId which is deleted key is false--
        let faculty = await facultyModel.findOne({ _id: data, isDeleted: false })

        if (!faculty) {
            return res.status(404).send({ status: false, message: "No facultys Available!!" })
        }
        return res.status(200).send({ status: true, message: 'Success', data: faculty })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}
//====================================================== Get All faculty ===================================================================//

const getfaculty = async function (req, res) {
    try {
        let pageno = req.body.pageno;
        let newpageno = pageno - 1;
        let pCount = 10;
        const ispage = req.body.isPagination ;

        let faculty = []; 

        if(ispage == 1){
            faculty = await facultyModel.find({isDeleted: false }).skip(newpageno * pCount)
            .limit(pCount);
        } else {
            faculty = await facultyModel.find({isDeleted: false }).skip(newpageno * pCount)
            .limit(pCount);
        }
       

        let facultyAll = await facultyModel.find({isDeleted: false });
        let faculty_count = Math.ceil(facultyAll.length/pCount);

        res.status(200).send({status:true, data: faculty, faculty_count});
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

// //---------------------------------------------------------Update Api-------------------------------------------------------//


const updatefaculty = async (req, res) => {

    const { facultyId, name,designation } = req.body;

    const data = {
        name,
        designation
        
    }
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'mankantlaweducation/faculty' });
        data.image = result.secure_url;

    }
    
    const updatedData = await facultyModel.findOneAndUpdate({ _id: facultyId }, data, { new: true });
    return res.status(201).json({ updatedData: updatedData });
}

//------------------------------------ Delete faculty ----------------------------------


const deletefaculty = async (req, res) => {

    try {
        let id = req.body.facultyId

        //check wheather objectId is valid or not--
        if (!isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "please enter valid id" })
        }

        const findfaculty = await facultyModel.findOne({ _id: id, isDeleted: false })

        if (!findfaculty) {
            return res.status(404).send({ status: false, message: 'No faculty found' })
        }

        const faultyDegreeCount = await facultyDegreeModel.countDocuments({ facultyId: id, isDeleted: false })

        if (faultyDegreeCount > 0) {
            return res.status(400).send({ status: false, message: 'Please delete faulty degree first' })
        }

        await facultyModel.findOneAndUpdate({ _id: id },
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true })
        return res.status(200).send({ status: true, message: "deleted sucessfully" })
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", msg: err.message })
    }
}



module.exports = {facultyAdd,deletefaculty,getfacultyById,getfaculty ,updatefaculty}