const studentInquiryModel = require("../models/student_inquiryModel");

const {
  isRequired,
  isInvalid,
  isValid,
 
} = require("../utils/studentInquiryValidation");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

//------------------------------------------------- API-1 [/register] --------------------------------------------------//

const createSudentInquiry = async function (req, res) {
  try {
    let data = req.body;
    

    let getEmail = await studentInquiryModel
      .findOne({ email: data.email })
      .collation({ locale: "en", strength: 2 });
    let getPhone = await studentInquiryModel.findOne({ phone: data.phone });
    let error = [];
    let err1 = isRequired(data);
    if (err1) error.push(...err1);

    let err2 = isInvalid(data, getEmail, getPhone);
    if (err2) error.push(...err2);

    if (error.length > 0)
      return res.status(400).send({ status: false, message: error });

    const createdUser = await studentInquiryModel.create(data);
    const { _id, name, email, phone } = createdUser;

    res
      .status(200)
      .send({
        status: true,
        message: "Data created successfully",
        data: { _id, name, email, phone },
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

//====================================================== Get All   ===================================================================//

const getAllInquiry = async function (req, res) {
    try {
      const getAll = await studentInquiryModel.find({ isDeleted: false });
      res.status(200).send({ status: true, data: getAll });
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  };
module.exports = {
   
    createSudentInquiry,
    getAllInquiry,
  };