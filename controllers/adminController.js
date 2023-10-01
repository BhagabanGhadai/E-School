const adminModel = require("../models/adminModel");
const user_macAddressModel = require("../models/user_macAddressModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const {
  isRequired,
  isInvalid,
  isValid,
} = require("../utils/adminValidation");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

//------------------------------------------------- API-1 [/Admin register] --------------------------------------------------//

const createadmin = async function (req, res) {
  try {
    let data = req.body;
    const { password } = req.body;

    let getEmail = await adminModel
      .findOne({ email: data.email })
      .collation({ locale: "en", strength: 2 });
    let error = [];
    let err1 = isRequired(data);
    if (err1) error.push(...err1);

    let err2 = isInvalid(data, getEmail);
    if (err2) error.push(...err2);

    if (error.length > 0)
      return res.status(400).send({ status: false, message: error });


    const Password = await bcrypt.hash(password, 10);


    data.password = await bcrypt.hash(data.password, 10);
   

    const createdadmin = await adminModel.create(data);
    const { _id, email } = createdadmin;

    res
      .status(200)
      .send({
        status: true,
        message: "Data created successfully",
        data: { _id,  email },
      });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};




//------------------------------------------------ API-2 [/Admin login] -------------------------------------------------------//

const loginadmin = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please Enter E-mail and Password..." });
    }
    let error = [];
    if (!isValid(email || phone))
      error.push("Please Enter Email ");
    if (!isValid(password)) error.push("Please Provide Password");
    if (
      typeof data.email == "string" &&
      !/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email?.trim())
    )
      error.push("enter a valid email");
    if (error.length > 0)
      return res.status(400).send({ status: false, msg: error });

    const admin = await adminModel
      .findOne({ $or: [{ email: email }] })
      .collation({ locale: "en", strength: 2 });
    if (!admin) {
      return res
        .status(400)
        .send({ status: false, msg: "email found" });
    }

    let result = await bcrypt.compare(password, admin.password);
    if (result == true) {
      const token = jwt.sign({ adminId: admin._id }, "mankantlaweducation", {
        expiresIn: "3000m",
      });
      const { _id,  email } = admin;

      res
        .status(200)
        .send({
          status: true,
          message: "logged in successfully",
          data: { token, _id, email},
        });
    } else if (result == false) {
      return res.status(400).send({ status: false, msg: "Incorrect Password" });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
    loginadmin,
    createadmin,
  };