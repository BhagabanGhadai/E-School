const facultyDegreeModel = require("../models/facultyDegreeModel");
const facultyModel = require("../models/facultyModel");

const cloudinary = require("../utils/cloudinary");
const {
  isRequired,
  isInvalid,
  isValid,
} = require("../utils/facultyDegreeValidation");
const slugify = require("slugify");
const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// //------------------------------------------------- API-1 [/Add faculty Degree] --------------------------------------------------//

const addfacultyDegree = async function (req, res) {
  try {
    let data = req.body;
    let facultyId = req.body.facultyId;

    let image = req.image;

    if (!isValidObjectId(facultyId)) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid facultyId" });
    }

    let check = await facultyModel
      .findOne({ _id: facultyId, isDeleted: false })
      .lean();
    if (!check) {
      return res
        .status(404)
        .send({ status: false, message: "course does'nt exist" });
    }

    let error = [];
    let err1 = isRequired(data, image);
    if (err1) error.push(...err1);

    let err2 = isInvalid(data, image);
    if (err2) error.push(...err2);

    if (error.length > 0)
      return res.status(400).send({ status: false, message: error });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mankantlaweducation/facultyDegree",
    });
    data.image = result.secure_url;

    let created = await facultyDegreeModel.create(data);
    res.status(201).send({
      status: true,
      message: "faculty Degree created successfully",
      data: created,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//====================================================== Get faculty Degree By Id ===================================================================//
const getfacultyDegreeById = async (req, res) => {
  try {
    const data = req.body.facultyDegreeId;

    if (!isValidObjectId(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Invaild facultyDegree Id" });
    }
    //find the facultyDegreeId which is deleted key is false--
    let facultyDegree = await facultyDegreeModel.findOne({
      _id: data,
      isDeleted: false,
    });

    if (!facultyDegree) {
      return res
        .status(404)
        .send({ status: false, message: "No facultyDegree Available!!" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: facultyDegree });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

//====================================================== Get By facultyId ===================================================================//
const getByFacultyId = async (req, res) => {
  try {
    const data = req.body.facultyId;

    if (!isValidObjectId(data)) {
      return res.status(400).send({ status: false, message: "Invaild facultyId" })
  }

  let Present = await facultyDegreeModel.find({facultyId:data,isDeleted: false })
 return res.status(200).send({status:true, data: Present})
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};
//====================================================== Get All faculty Degree===================================================================//

const getAllfacultyDegree = async function (req, res) {
  try {
    let facultyDegreePresent = await facultyDegreeModel.find({
      isDeleted: false,
    });
    res.status(200).send({ status: true, data: facultyDegreePresent });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// //---------------------------------------------------------Update Api-------------------------------------------------------//

const updatefacultyDegree = async (req, res) => {
  const { facultyDegreeId, university, short_description } = req.body;

  const data = {
    university,
    short_description,
  };
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mankantlaweducation/facultyDegree",
    });
    data.image = result.secure_url;
  }

  const updatedData = await facultyDegreeModel.findOneAndUpdate(
    { _id: facultyDegreeId },
    data,
    { new: true }
  );
  return res.status(201).json({ updatedData: updatedData });
};

//------------------------------------ Delete faculty Degree----------------------------------

const deletefacultyDegree = async (req, res) => {
  try {
    let id = req.body.facultyDegreeId;
    //check wheather objectId is valid or not--
    if (!isValidObjectId(id)) {
      return res
        .status(400)  
        .send({ status: false, message: "please enter valid id" });
    }

    const findfacultyDegree = await facultyDegreeModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!findfacultyDegree) {
      return res
        .status(404)
        .send({ status: false, message: "No facultyDegree found" });
    }

    await facultyDegreeModel.findOneAndUpdate(
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
  addfacultyDegree,
  getfacultyDegreeById,
  getByFacultyId,
  getAllfacultyDegree,
  updatefacultyDegree,
  deletefacultyDegree,
};
