const testinomialModel = require("../models/testinomialModel");
const examModel = require("../models/examModel");

const cloudinary = require("../utils/cloudinary");
const {
  isRequired,
  isInvalid,
  isValid,
} = require("../utils/testinomialValidation");
const slugify = require("slugify");
const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// //------------------------------------------------- API-1 [/Add testinomial] --------------------------------------------------//

const addTestinomial = async function (req, res) {
  try {
    let data = req.body;
    let image = req.image;

    let error = [];
    let err1 = isRequired(data, image);
    if (err1) error.push(...err1);

    let err2 = isInvalid(data, image);
    if (err2) error.push(...err2);

    if (error.length > 0)
      return res.status(400).send({ status: false, message: error });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mankantlaweducation/testinomial",
    });
    data.image = result.secure_url;

    let created = await testinomialModel.create(data);
    res.status(201).send({
      status: true,
      message: "testinomial created successfully",
      data: created,
    });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//====================================================== Get Testinomial By Id ===================================================================//
const getTestinomialById = async (req, res) => {
  try {
    const data = req.body.testinomialId;

    if (!isValidObjectId(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Invaild testinomial Id" });
    }
    //find the testinomialId which is deleted key is false--
    let testinomial = await testinomialModel.findOne({
      _id: data,
      isDeleted: false,
    });

    if (!testinomial) {
      return res
        .status(404)
        .send({ status: false, message: "No testinomial Available!!" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: testinomial });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};
//====================================================== Get All Testinomial===================================================================//

const getAllTestinomial = async function (req, res) {
  try {
    let testinomialPresent = await testinomialModel.find({ isDeleted: false });
    res.status(200).send({ status: true, data: testinomialPresent });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// //---------------------------------------------------------Update Api-------------------------------------------------------//

const updateTestinomial = async (req, res) => {
  const { testinomialId, name, rank,description } = req.body;

  const data = {
    name,
    rank,
    description,
  };
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mankantlaweducation/testinomial",
    });
    data.image = result.secure_url;
  }

  const updatedData = await testinomialModel.findOneAndUpdate(
    { _id: testinomialId },
    data,
    { new: true }
  );
  return res.status(201).json({ updatedData: updatedData });
};

//------------------------------------ Delete testinomial----------------------------------

const deleteTestinomial = async (req, res) => {
  try {
    let id = req.body.testinomialId;
    //check wheather objectId is valid or not--
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid id" });
    }

    const findTestinomial = await testinomialModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!findTestinomial) {
      return res
        .status(404)
        .send({ status: false, message: "No Testinomial found" });
    }

    await testinomialModel.findOneAndUpdate(
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
  addTestinomial,
  getTestinomialById,
  getAllTestinomial,
  updateTestinomial,
  deleteTestinomial,
};
