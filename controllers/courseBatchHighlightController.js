const courseBatchHightlightModel = require('../models/courseBatchHighlight')
const courseBatchModel = require('../models/courseBatchModel')

const { isRequired,  isValid} = require("../utils/courseBatchHighlightValidation")
const slugify = require('slugify')
const mongoose = require('mongoose')

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


// //------------------------------------------------- API-1 [/Add course Batch Hightlight] --------------------------------------------------//

const addcourseBatchHightlight= async function (req, res) {
   
    try {
        let data = req.body
        let courseBatchId = req.body.courseBatchId

        if (!isValidObjectId(courseBatchId)) {
            return res.status(400).send({ status: false, message: "plz enter valid courseBatchId" })
        }


        let check = await courseBatchModel.findOne({ _id:courseBatchId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "course batch does'nt exist" })
        }
        let error = []
        let err1 = isRequired(data)
        if (err1)
            error.push(...err1)


        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

      
        let created = await courseBatchHightlightModel.create(data)
        res.status(201).send({ status: true, message: "courseBatchHightlight created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//======================================================Get course Batch Hightlight===================================================================//
const getcourseBatchHightlightById = async (req, res) => {
    try {
        const data = req.body.courseBatchHightlightId

        if (!isValidObjectId(data)) {
            return res.status(400).send({ status: false, message: "Invaild courseBatchHightlight Id" })
        }
        //find the courseBatchHightlightId which is deleted key is false--
        let courseBatchHightlight = await courseBatchHightlightModel.findOne({isDeleted: false,_id: data})

        if (!courseBatchHightlight) {
            return res.status(404).send({ status: false, message: "No courseBatchHightlight Available!!" })
        }
        return res.status(200).send({ status: true, message: 'Success', data:courseBatchHightlight })
    }
    catch (error) {
        res.status(500).send({ Error: error.message })
    }
}

//======================================================Get All course Batch Hightlight===================================================================//

const getAllcourseBatchHightlight = async function (req, res) {
    try {
        const pageno = req.body.pageno;
        const batch_id = req.body.batch_id;
        const newpageno = pageno-1;
        const pCount = 10;
        const ispage = req.body.isPagination 
        let courseBatchHightlight = []; 
    
        if(ispage == 1){
            courseBatchHightlight = await courseBatchHightlightModel.find({batch_id: batch_id, isDeleted: false }).skip(newpageno * pCount).limit(pCount); } else {
                courseBatchHightlight=  await courseBatchHightlightModel.find({batch_id: batch_id, isDeleted: false }).skip(newpageno * pCount).limit(pCount);     }
        
        let courseBatchHightlightPresent = await courseBatchHightlightModel.find({courseBatchId: batch_id, isDeleted: false }).skip(newpageno * pCount).limit(pCount);

        let batch_count = Math.ceil(courseBatchHightlightPresent.length/pCount);

        res.status(200).send({status:true, data: courseBatchHightlight, batch_count});
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

//     try {
//         const pageno = req.body.pageno;
//         const batch_id = req.body.batch_id;
//         const newpageno = pageno - 1;
//         const pCount = 3;
//         const ispage = req.body.isPagination;

//         let courseBatchHightlight = await courseBatchHightlightModel.find({ batch_id: batch_id, isDeleted: false }).skip(newpageno * pCount).limit(pCount);

//         let courseBatchHightlightPresent = await courseBatchHightlightModel.find({ batch_id: batch_id, isDeleted: false }).skip(newpageno * pCount).limit(pCount);

//         let batch_count = Math.ceil(courseBatchHightlightPresent.length / pCount);

//         res.status(200).send({ status: true, data: courseBatchHightlight, batch_count });
//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message });
//     }
// }



// //---------------------------------------------------------Update course Batch Hightlight-------------------------------------------------------//


const updatecourseBatchHightlight = async function (req, res) {
    try {

       const { courseBatchHightlightId} = req.body;
    
        const data = {
            title:req.body.title,
            
        }
        const updatedData = await courseBatchHightlightModel.findOneAndUpdate({ _id:courseBatchHightlightId}, data, { new: true });
        return res.status(201).json({ updatedData:updatedData });  
    }
catch (err) {
    res.status(500).send({ status: false, message: err.message })
}
}

//------------------------------------Delete course batch highlight Question----------------------------------


   const deletecourseBatchHightlight = async (req, res) => {

    try {
      let id = req.body.courseBatchHightlightId
  
  
  //check wheather objectId is valid or not--
      if (!isValidObjectId(id)) {
  
        return res.status(400).send({ status: false, message: "please enter valid courseBatchHightlight Id" })
      }
  
      const findcourseBatchHightlight = await courseBatchHightlightModel.findOne({ _id:id, isDeleted: false })
  
  
      if (!findcourseBatchHightlight) {
        return res.status(404).send({ status: false, message: 'No courseBatchHightlight  found' })
      }
  
      await courseBatchHightlightModel.findOneAndUpdate({ _id: id },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true })
      return res.status(200).send({ status: true, message: "course Batch Hightlight deleted sucessfully" })
    }
    catch (err) {
      console.log(err.message)
      return res.status(500).send({ status: "error", msg: err.message })
    }
  }

module.exports = {addcourseBatchHightlight,getcourseBatchHightlightById,getAllcourseBatchHightlight,updatecourseBatchHightlight,deletecourseBatchHightlight}