const chapterModel = require('../models/chapterModel')
const videoModel = require('../models/videoModel')
const slugify = require('slugify')
const mongoose = require('mongoose')
const { isRequired} = require("../utils/videoValidation")


// const isValidObjectId = function (objectId) {
//     return mongoose.Types.ObjectId.isValid(objectId)
// }

const { Storage } = require("@google-cloud/storage");
  
  let projectId = "mankant"; // Get this from Google Cloud
  let keyFilename = "../mankant-7ef596354a18.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
  const storage = new Storage({
    projectId,
    keyFilename,
  });
  const bucket = storage.bucket("mankant"); // Get this from Google Cloud -> Storage




// //-------------------------------------------------API-1 [/Add Video]--------------------------------------------------//

const videoAdd= async function (req, res) {
   
    try {
        let data = req.body
        let chapterId = req.body.chapterId
        let video= req.video
        // if (!isValidObjectId(chapterId)) {
        //     return res.status(400).send({ status: false, message: "plz enter valid chapterId" })
        // }


        let check = await chapterModel.findOne({ _id:chapterId, isDeleted: false }).lean()
        if (!check) {
            return res.status(404).send({ status: false, message: "chapter does'nt exist" })
        }
      
        let error = []
        let err1 = isRequired(data, video)
        // if (err1)
        //     error.push(...err1)

        // let err2 = isInvalid(data, video)
        // if (err2)
        //     error.push(...err2)

        // if (error.length > 0)
        //     return res.status(400).send({ status: false, message: error })
            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream();
           
      
            blobStream.on("finish", async() => {
              let videosArray = [];
        
                let video_url = "https://oauth2.googleapis.com"+req.file.originalname;
            
              console.log(video_url);
            });
            blobStream.end(req.file.buffer);
          
          data.video_slug= slugify(req.body.video_name);
      
            let created = await videoModel.create(data)
        res.status(201).send({ status: true, message: "video created successfully", data:created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


// //======================================================Get video===================================================================//
// const getVideoById = async (req, res) => {
//     try {
//         const data = req.body.videoId

//         if (!isValidObjectId(data)) {
//             return res.status(400).send({ status: false, message: "Invaild video Id" })
//         }
//         //find the videoId which is deleted key is false--
//         let video = await videoModel.findOne({ _id: data, isDeleted: false })

//         if (!video) {
//             return res.status(404).send({ status: false, message: "No video Available!!" })
//         }
//         return res.status(200).send({ status: true, count: video.length, message: 'Success', data: video })
//     }
//     catch (error) {
//         res.status(500).send({ Error: error.message })
//     }
// }

// //======================================================Get All video===================================================================//

// const getAllVideo = async function (req, res) {
//     try {

//         const data = req.body.chapterId

//         if (!isValidObjectId(data)) {
//             return res.status(400).send({ status: false, message: "Invaild chapterId" })
//         }
       
//         let videoPresent = await videoModel.find({isDeleted: false,chapterId:data})
//         res.status(200).send({status:true, data: videoPresent})
//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message });
//     }
// }

// //------------------------------------Delete video----------------------------------

// const deleteVideo= async (req, res) => {

//     try {
//       let id = req.body.videoId
  
  
//   //check wheather objectId is valid or not--
//       if (!isValidObjectId(id)) {
  
//         return res.status(400).send({ status: false, message: "please enter valid id" })
//       }
  
//       const findvideo = await videoModel.findOne({ _id: id, isDeleted: false })
  
  
//       if (!findvideo) {
//         return res.status(404).send({ status: false, message: 'No video found' })
//       }
  
//       await videoModel.findOneAndUpdate({ _id: id },
//         { $set: { isDeleted: true, deletedAt: Date.now() } },
//         { new: true })
//       return res.status(200).send({ status: true, message: "deleted sucessfully" })
//     }
//     catch (err) {
//       console.log(err.message)
//       return res.status(500).send({ status: "error", msg: err.message })
//     }
//   }



// module.exports = {videoAdd ,getAllVideo,deleteVideo,getVideoById}
module.exports = {videoAdd }


