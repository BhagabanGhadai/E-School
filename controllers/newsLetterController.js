const newsLetterModel = require("../models/newsLetter");

const {
  isRequired,
  isInvalid,
  isValid,
} = require("../utils/newsLetterValidation");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};
const mongoose = require("mongoose");

//------------------------------------------------- API-1 [/register Email] --------------------------------------------------//

const registerEmail = async function (req, res) {
  try {
    let data = req.body;

    let getEmail = await newsLetterModel
      .findOne({ email: data.email })
      .collation({ locale: "en", strength: 2 });

    let error = [];
    let err1 = isRequired(data);
    if (err1) error.push(...err1);

    let err2 = isInvalid(data, getEmail);
    if (err2) error.push(...err2);

    if (error.length > 0)
      return res.status(400).send({ status: false, message: error });

    const created = await newsLetterModel.create(data);

    res
      .status(200)
      .send({
        status: true,
        message: "Email Register successfully",
        data: created,
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//------------------------------------------------- API-1 [/get Email] --------------------------------------------------//
const getEmailById = async (req, res) => {
  try {
    const data = req.body.mailId;

    if (!isValidObjectId(data)) {
      return res.status(400).send({ status: false, message: "Invaild mailId" });
    }
    //find the mailId which is deleted key is false--
    let gmail = await newsLetterModel.findOne({ _id: data, isDeleted: false });

    if (!gmail) {
      return res
        .status(404)
        .send({ status: false, message: "No gmails Available!!" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: gmail });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

//====================================================== Get All News Letter ===================================================================//

const getAllNewsLetter = async function (req, res) {
  try {

      let Present = await newsLetterModel.find({isDeleted: false })
      res.status(200).send({status:true, data: Present})
  } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
  }
}

// //--------------------------------------------------------- Update Gmail Api -------------------------------------------------------//

const updateGmail = async (req, res) => {
  const { emailId } = req.body;

  const data = {
    email: req.body.email,
  };

  const updatedData = await newsLetterModel.findOneAndUpdate(
    { _id: emailId },
    data,
    { new: true }
  );
  return res.status(201).json({ updatedData: updatedData });
};

// ------------------------------------ Delete gmail ----------------------------------

const deleteGmail = async function (req, res) {
  try {
    const emailId = req.body.emailId;
    if (!isValidObjectId(emailId)) {
      return res.status(400).send({ status: false, msg: " invalid emailId " });
    }
    const deletedDetails = await newsLetterModel.findOneAndUpdate(
      { _id: emailId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    if (!deletedDetails) {
      return res
        .status(404)
        .send({ status: false, message: "emailId does not exist" });
    }
    return res
      .status(200)
      .send({ status: true, message: "email deleted successfully." });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { registerEmail, getEmailById,getAllNewsLetter, updateGmail, deleteGmail };
