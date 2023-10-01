const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

const mongoose = require("mongoose");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const slugify = require("slugify");
const videosModel = require("../models/videosModel");
const chapterModel = require('../models/chapterModel')
// Google cloud upload
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

let projectId = "videoupload-3d6b2"; // Get this from Google Cloud
let keyFilename = "myKey.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  projectId,
  keyFilename,
});

const bucket = storage.bucket("videoupload-3d6b2.appspot.com"); // Get this from Google Cloud -> Storage

//------------------------------------Upload Video--------------------------------//
router.post("/video/uploadbkp", multer.single("imgfile"), async (req, res) => {
  console.log("Made it /upload");
  if (!req.body.chapter_id && !req.body.video_name) {
    return res.status(500).json({
      success: false,
      message: "enter chapter_id and video",
    });
  }
  if (!mongoose.isValidObjectId(req.body.chapter_id)) {
    return res.status(500).json({
      success: false,
      message: "enter chapter_id is not valid",
    });
  }

  try {
    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", async () => {
        let video_url =
          "https://storage.googleapis.com/videoupload-3d6b2.appspot.com/" +
          req.file.originalname;
        console.log(video_url);
        const video_data = {
          video_name: req.body.video_name,
          thumbnail: req.body.thumbnail,

          video_slug: slugify(req.body.video_name),
          video: video_url,
          chapterId: req.body.chapter_id,
          description: req.body.description,
        };
        let created = await videosModel.create(video_data);
        res
          .status(201)
          .send({
            status: true,
            message: "Video created successfully",
            data: created,
          });
      });
      blobStream.end(req.file.buffer);
    } else throw "error with img";
  } catch (error) {
    res.status(500).send(error);
  }
});


//------------------------------------Upload Video--------------------------------//
router.post("/video/upload", async (req, res) => {
  
  if (!req.body.chapter_id) {
    return res.status(500).json({
      success: false,
      message: "enter chapter_id and video",
    });
  }
  if (!mongoose.isValidObjectId(req.body.chapter_id)) {
    return res.status(500).json({
      success: false,
      message: "enter chapter_id is not valid",
    });
  }
  
  try {
    const video_data = {
      showCase: req.body.video
    };

    // console.log(video_data);
    // return;

    const updatedData = await chapterModel.findOneAndUpdate({ _id: req.body.chapter_id }, video_data, { new: true });

    // console.log(updatedData);
    // return;
    
    // let created = await videosModel.create(video_data);
    if(updatedData){
      res
      .status(201)
      .send({
        status: true,
        message: "Video added successfully",
      });
    }else{
      res
      .status(400)
      .send({
        status: true,
        message: "Something went wrong"
      });

    }
  
    
  } catch (error) {
    res.status(500).send(error);
  }
});

//-----------------------------------------------------Get By Id--------------------------------//

router.post("/video/getById", async (req, res) => {
  try {
    const data = req.body.videoId;

    if (!mongoose.isValidObjectId(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid video Id" });
    }
    //find the videoId which is deleted key is false--
    let video = await videosModel.findOne({ _id: data, isDeleted: false });

    if (!video) {
      return res
        .status(404)
        .send({ status: false, message: "No video Available!!" });
    }
    return res
      .status(200)
      .send({
        status: true,
        message: "Success",
        data: video,
      });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});
//-----------------------------------------------------get all video by chapterId--------------------------------//
router.post("/video/getBychapterId", async (req, res) => {
  try {
    const data = req.body.chapterId;
    const pageno = req.body.pageno;
    const isPagination = req.body.isPagination;

    const newpagno = pageno - 1;
    const pCount = 10; 

    if (!mongoose.isValidObjectId(data)) {
      return res.status(400).send({ status: false, message: "Invalid chapterId" });
    }

    // let videoPresent;
    // let video_count;

    // if (isPagination == 1){
    //     videoPresent = await videosModel
    //       .find({ chapterId: data, isDeleted: false })
    //       .skip(newpagno * pCount)
    //       .limit(pCount);

    //    video_count = Math.ceil(videoPresent.length / pCount); 
        
    // }

    //  if (isPagination == 0) {
    //     videoPresent = await videosModel.find({
    //       chapterId: data,
    //       isDeleted: false,
    //     });

    //     video_count = Math.ceil(videoPresent.length);
    //  }
      
    //  chapterModel
    let chapter = await chapterModel.findOne({
      _id: data,
      isDeleted: false,
    });
   

    return res.status(200).send({ status: true, showcase: chapter.showCase });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
});



//------------------------------------Update Video--------------------------------//
router.post("/video/updatebkp", multer.single("imgfile"), async (req, res) => {
  try {
    const { videoId, description, thumbnail } = req.body; 
    // Check if the video exists in the database
    const existingVideo = await videosModel.findById(videoId);
    if (!existingVideo) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }
    // Update the video properties
    existingVideo.video_name = req.body.video_name || existingVideo.video_name;
    existingVideo.video_slug = slugify(req.body.video_name) || existingVideo.video_slug;
    existingVideo.description = description || existingVideo.description;
    existingVideo.thumbnail = thumbnail || existingVideo.thumbnail; 

    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", async () => {
        const video_url =
          "https://storage.googleapis.com/videoupload-3d6b2.appspot.com/" +
          req.file.originalname;
        console.log(video_url);
        existingVideo.video = video_url;
        await existingVideo.save();
        res.status(200).json({
          success: true,
          message: "Video updated successfully",
          data: existingVideo,
        });
      });
      blobStream.end(req.file.buffer);
    } else {
      // No new video file provided, just update the database record
      await existingVideo.save();
      res.status(200).json({
        success: true,
        message: "Video updated successfully",
        data: existingVideo,
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post("/video/update", async (req, res) => {
  try {
    const { videoId } = req.body; 
    // Check if the video exists in the database
    const existingVideo = await videosModel.findById(videoId);
    if (!existingVideo) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const data = {
      video: req.body.video
    }
    // Update the video properties
    const updatedData = await videosModel.findOneAndUpdate({_id:videoId}, data, {new: true});

    if(updatedData){
      return res.status(201).json({ 'msg': 'Successfully updated' });
    }
   
  } catch (error) {
    res.status(500).send(error);
  }
});


//-----------------------------------------------------delete--------------------------------//
router.delete("/video/delete", async (req, res) => {
  try {
    let id = req.body.videoId;

    //check wheather objectId is valid or not--
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid id" });
    }

    const findvideo = await videosModel.findOne({ _id: id, isDeleted: false });

    if (!findvideo) {
      return res.status(404).send({ status: false, message: "No video found" });
    }
       await videosModel.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "deleted sucessfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send({ status: "error", msg: err.message });
  }
});

module.exports = router;
