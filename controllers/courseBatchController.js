const courseBatchModel = require('../models/courseBatchModel')
const courseBatchHighlightModel = require('../models/courseBatchHighlight')

const courseModel = require('../models/courseModel')


const { isRequired, isInvalid, isValid} = require("../utils/courseBatchValidation")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const mongoose = require('mongoose')

// //-------------------------------------------------API-1 [/add course Batch]--------------------------------------------------//

const addBatchCourse = async function (req, res) {
   
    try {
        let data = req.body
        let courseId = req.body.courseId
        let highlights = req.body.highlights;
       

        if (!isValidObjectId(courseId)) {
            return res.status(400).send({ status: false, message: "plz enter valid courseId" })
        }


        let check = await courseModel.findOne({ _id:courseId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "course does'nt exist" })
        }
        let error = []
        let err1 = isRequired(data)
        if (err1)
            error.push(...err1)


        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })
      
           
       let created = await courseBatchModel.create(data);
       let courseBatchId = created._id.toString();

        for(let i = 0; i < highlights.length; i++){
            let dataSub = {
                courseBatchId: courseBatchId,
                title: highlights[i]
            }

             let checkCourseBatch = await courseBatchHighlightModel
               .findOne({ courseBatchId: courseBatchId, title: highlights[i], isDeleted: false })
               .lean();
             if (!checkCourseBatch) {
                    let assignSub = await courseBatchHighlightModel.create(dataSub);
             }

        }
        res.status(201).send({ status: true, message: "course Batch created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const getcourseBatchByIdV2 = async (req, res) => {
    try {
        const data = req.body.courseBatchId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild courseBatchId" })
        }
        let query = {}
        query["_id"] = new mongoose.Types.ObjectId(data);
        //find the whycourseBatchId which is deleted key is false--
        let courseBatch = await courseBatchModel.aggregate([
            {
                $match: query
            },
            {
                $project: {
                    createdAt: 0,
                    updatedAt: 0,
                    isDeleted: 0
                }
            },
            {
                $lookup: {
                    from: "coursebatchhighlights",
                    let: {
                        "course_batch_id": "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$courseBatchId", "$$course_batch_id"]
                                }
                            }
                        },
                        {
                            $project: {
                                createdAt: 0,
                                updatedAt: 0,
                                isDeleted: 0,
                                courseBatchId: 0,
                                __v: 0
                            }
                        }
                    ],
                    as: "highlights"
                }
            },
        ]).exec();

        if (!courseBatch) {
            return res.status(404).send({ status: false, message: "No course Batch Available!!" })
        }
        return res.status(200).send({ status: true,  message: 'Success', data: courseBatch })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get course Batch ===================================================================//
const getcourseBatchById = async (req, res) => {
    try {
        const data = req.body.courseBatchId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild courseBatchId" })
        }
        //find the whycourseBatchId which is deleted key is false--
        let courseBatch = await courseBatchModel.findOne({ _id: data, isDeleted: false })

        if (!courseBatch) {
            return res.status(404).send({ status: false, message: "No course Batch Available!!" })
        }
        return res.status(200).send({ status: true,  message: 'Success', data: courseBatch })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//====================================================== Get All Course Batch ===================================================================//

const getAllcourseBatch = async function (req, res) {
    try {
        const pageno = req.body.pageno;
        const newpageno = pageno-1;
        const pCount = 10;
        const ispage = req.body.isPagination
        let courseBatch = []; 
    
        if(ispage == 1){
            courseBatch =  await courseBatchModel.find({isDeleted: false }).skip(newpageno * pCount)
            .limit(pCount) } else {
                courseBatch=  await courseBatchModel.find({isDeleted: false }).skip(newpageno * pCount)
                .limit(pCount)       }
       
        let courseBatchAll = await courseBatchModel.find({isDeleted: false });
        let courseBatch_count = Math.ceil(courseBatchAll.length/pCount);

        res.status(200).send({status:true, data: courseBatch, courseBatch_count})
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


// //--------------------------------------------------------- Update course Batch Api -------------------------------------------------------//

const updatecourseBatchV2 = async (req, res) => {

    const {courseBatchId} = req.body;
    let highlights = req.body.highlights;
  
      const data = {
          title:req.body.title,
          description:req.body.description,
       }
     
   const updatedData = await courseBatchModel.findOneAndUpdate({_id:courseBatchId}, data, {new: true});

        for(let i = 0; i < highlights.length; i++){
            let dataSub = {
                title: highlights[i].title
            }

         const updatedData = await courseBatchHighlightModel.findOneAndUpdate({_id:highlights[i]._id}, dataSub, {new: true});

        }
      return res.status(201).json({ updatedData: updatedData });
  }


// //--------------------------------------------------------- Update course Batch Api -------------------------------------------------------//

const updatecourseBatch = async (req, res) => {

  const {courseBatchId} = req.body;

    const data = {
        title:req.body.title,
        description:req.body.description,
     }
   
 const updatedData = await courseBatchModel.findOneAndUpdate({_id:courseBatchId}, data, {new: true});
    return res.status(201).json({ updatedData: updatedData });
}

// ------------------------------------ Delete courseBatch ----------------------------------

const deletecourseBatch = async function (req, res) {
    try {
        const courseBatchId = req.body.courseBatchId
        if (!isValidObjectId(courseBatchId)) {
            return res.status(400).send({ status: false, msg: " invalid courseBatchId " });
        }

        const courseBatchHighlightCount = await courseBatchHighlightModel.countDocuments({ courseBatchId: courseBatchId, isDeleted: false })
        if (courseBatchHighlightCount > 0) {
            return res.status(400).send({ status: false, message: 'Please delete the course batch highlights first' })
        }

        const deletedDetails = await courseBatchModel.findOneAndUpdate(
            { _id: courseBatchId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })

        if (!deletedDetails) {
            return res.status(404).send({ status: false, message: 'course Batch Id does not exist' })
        }
        return res.status(200).send({ status: true, message: 'course Batch deleted successfully.' })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



module.exports = {addBatchCourse,getcourseBatchById,getcourseBatchByIdV2,getAllcourseBatch,updatecourseBatch,updatecourseBatchV2,deletecourseBatch}