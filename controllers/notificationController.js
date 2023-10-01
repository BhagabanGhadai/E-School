const notificationModel = require("../models/notificationModel");

const cloudinary = require("../utils/cloudinary");
const {
  isRequired,
  isValid,
} = require("../utils/notificationValidation");
const slugify = require("slugify");
const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// //------------------------------------------------- API-1 [/Add notification ] --------------------------------------------------//

const addnotification = async function (req, res) {
  try {
    let data = req.body;
    let image = req.image;

    let error = [];
    let err1 = isRequired(data, image);
    if (err1) error.push(...err1);

    if (error.length > 0)
      return res.status(400).send({ status: false, message: error });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mankantlaweducation/notification",
    });
    data.image = result.secure_url;

    let created = await notificationModel.create(data);
    res.status(201).send({
      status: true,
      message: "notification  created successfully",
      data: created,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//====================================================== Get notification  By Id ===================================================================//
const getnotificationById = async (req, res) => {
  try {
    const data = req.body.notificationId;

    if (!isValidObjectId(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Invaild notification Id" });
    }
    //find the notificationId which is deleted key is false--
    let notification = await notificationModel.findOne({
      _id: data,
      isDeleted: false,
    });

    if (!notification) {
      return res
        .status(404)
        .send({ status: false, message: "No notification Available!!" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: notification });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};
//====================================================== Get All notification ===================================================================//

const getAllnotification = async function (req, res) {
  try {
    let pageno = req.body.pageno;
    let newpageno = pageno - 1;
    let pCount = 10;

    const ispage = req.body.isPagination ;

    let notification = []; 

    if(ispage == 1){
      notification =  await notificationModel.find({
        isDeleted: false,
      }).skip(newpageno * pCount)
      .limit(pCount);
    } else {
      notification =  await notificationModel.find({
        isDeleted: false,
      }).skip(newpageno * pCount)
      .limit(pCount);
    }
    

    let notificationAll = await notificationModel.find({
      isDeleted: false,
    });

    let notification_count = Math.ceil(notificationAll.length/pCount);

    res.status(200).send({ status: true, data: notification, notification_count});
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// //---------------------------------------------------------Update Api-------------------------------------------------------//

const updatenotification = async (req, res) => {
  const { notificationId, title, description } = req.body;

  const data = {
    title,
    description,
    status:req.body.status,
  };
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mankantlaweducation/notification",
    });
    data.image = result.secure_url;
  }

  const updatedData = await notificationModel.findOneAndUpdate(
    { _id: notificationId },[{ $addFields: data }],{ new: true });
  return res.status(201).json({ updatedData: updatedData });
};

//------------------------------------ Delete notification ----------------------------------

const deletenotification = async (req, res) => {
  try {
    let id = req.body.notificationId;
    //check wheather objectId is valid or not--
    if (!isValidObjectId(id)) {
      return res
        .status(400)  
        .send({ status: false, message: "please enter valid id" });
    }

    const findnotification = await notificationModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!findnotification) {
      return res
        .status(404)
        .send({ status: false, message: "No notification found" });
    }

    await notificationModel.findOneAndUpdate(
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
};

module.exports = {
  addnotification,
  getnotificationById,
  getAllnotification,
  updatenotification,
  deletenotification,
};