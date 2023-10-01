const achiversModel = require("../models/achiversModel");
const examModel = require("../models/examModel");

const cloudinary = require("../utils/cloudinary");
const {
  isRequired,
  isInvalid,
  isValid,
} = require("../utils/chapterValidation");
const slugify = require("slugify");
const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

// //------------------------------------------------- API-1 [/Add Achivers] --------------------------------------------------//

const addAchivers = async function (req, res) {
  try {
    let data = req.body;
    let examId = req.body.examId;
    let image = req.image;

    if (!isValidObjectId(examId)) {
      return res
        .status(400)
        .send({ status: false, message: "plz enter valid examId" });
    }

    let check = await examModel
      .findOne({ _id: examId, isDeleted: false })
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
      folder: "mankantlaweducation/addachivers",
    });
    data.image = result.secure_url;

    let created = await achiversModel.create(data);
    res
      .status(201)
      .send({
        status: true,
        message: "Achivers created successfully",
        data: created,
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//====================================================== Get Achiver By Id ===================================================================//
const getAchiverById = async (req, res) => {
  try {
    const data = req.body.achiversId;

    if (!isValidObjectId(data)) {
      return res
        .status(400)
        .send({ status: false, message: "Invaild Achiver Id" });
    }
    //find the achiversId which is deleted key is false--
    let Achiver = await achiversModel.findOne({ _id: data, isDeleted: false });

    if (!Achiver) {
      return res
        .status(404)
        .send({ status: false, message: "No Achiver Available!!" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: Achiver });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};
//====================================================== Get All Achiver===================================================================//

const getAchiver = async function (req, res) {
  try {
    const pageno = req.body.pageno;
    const newpageno = pageno - 1;
    const pCount = 10;
    const ispage = req.body.isPagination 
    let Achiver = [];

    if (ispage == 1) {
      Achiver = await achiversModel.find({ isDeleted: false }).skip(newpageno * pCount).limit(pCount);
    } else {
      Achiver = await achiversModel.find({ isDeleted: false });
    }

    let getAll = await achiversModel.find({ isDeleted: false });
    let achievers_count = Math.ceil(getAll.length / pCount);

    res.status(200).send({ status: true, data: Achiver, achievers_count });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};



// //---------------------------------------------------------Update Api-------------------------------------------------------//

const updatechapter = async (req, res) => {
  const { achiversId, student_name, student_rank } = req.body;

  const data = {
    student_name,
    student_rank,
  };
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "mankantlaweducation/addachivers",
    });
    data.image = result.secure_url;
  }

  const updatedData = await achiversModel.findOneAndUpdate(
    { _id: achiversId },
    data,
    { new: true }
  );
  return res.status(201).json({ updatedData: updatedData });
};

//------------------------------------ Delete Achiver ----------------------------------

const deleteAchiver = async (req, res) => {
  try {
    let id = req.body.achiversId;
    //check wheather objectId is valid or not--
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid id" });
    }

    const findAchiver = await achiversModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!findAchiver) {
      return res
        .status(404)
        .send({ status: false, message: "No Achiver found" });
    }

    await achiversModel.findOneAndUpdate(
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
  addAchivers,
  deleteAchiver,
  getAchiverById,
  getAchiver,
  updatechapter,
};
