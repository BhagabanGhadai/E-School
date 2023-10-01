const achiversModel = require("../models/achiversModel");
const courseModel = require('../models/courseModel')
const examModel = require("../models/examModel");

const https = require("https");

const PaytmChecksum = require("paytmchecksum/PaytmChecksum");

const slugify = require("slugify");
const mongoose = require("mongoose");

const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};



//====================================================== Get Achiver By Id ===================================================================//
const getPayment = async (req, res) => {
  try {
    // const uniqueId = 'ORD'; // Unique identifier for your orders
// const timestamp = Date.now(); // Current timestamp in milliseconds
// const orderId = `${uniqueId}_${timestamp}`;
const orderId = req.body.orderId;
const courseId = req.body.courseId;
let course = await courseModel.findOne({ _id: courseId, isDeleted: false })
        if (!course) {
            return res.status(404).send({ status: false, message: "No courses Available!!" })
        }


    var paytmParams = {};

        paytmParams.body = {
                requestType: "Payment",
                mid: "ANUJAL09779437228312",
                websiteName: "Mankavit",
                orderId: orderId,
                callbackUrl: "https://classic.mankavit.com/checking",
                txnAmount: {
                    value: course.price,
                    currency: "INR",
                },
                userInfo: {
                    custId: "CUST_001",
                },
        };
        PaytmChecksum.generateSignature(
            JSON.stringify(paytmParams.body),
            "WySMh83K9oD@3p&N"
          ).then(function (checksum) {
            paytmParams.head = {
              signature: checksum,
            };
          
            var post_data = JSON.stringify(paytmParams);
          
            var options = {
              /* for Staging */
              hostname: "securegw.paytm.in",
          
              /* for Production */
              // hostname: 'securegw.paytm.in',
          
              port: 443,
              path: "/theia/api/v1/initiateTransaction?mid=ANUJAL09779437228312&orderId="+orderId,
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Content-Length": post_data.length,
              },
            };
          
            var response = "";
            var post_req = https.request(options, function (post_res) {
              post_res.on("data", function (chunk) {
                response += chunk;
              });
          
              post_res.on("end", function () {
                console.log("Response: ", response);
                return res.status(200).json({status: true, message: "Success", data: response});
              });
            });
          
            post_req.write(post_data);
            post_req.end();
          });

        return;

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
    let getPresent = await achiversModel
      .find({ isDeleted: false })
      .skip(pageno * 3)
      .limit(3);
    res.status(200).send({status:true, data: getPresent})
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

const getPaymentStatus = async (req, res) => {
  try {
  
    const orderId = req.body.orderId;
    var paytmParams = {};

        paytmParams.body = {
                mid: "ANUJAL09779437228312",
                orderId: orderId,
        };
        PaytmChecksum.generateSignature(
            JSON.stringify(paytmParams.body),
            "WySMh83K9oD@3p&N"
          ).then(function (checksum) {
            paytmParams.head = {
              signature: checksum,
            };
          
            var post_data = JSON.stringify(paytmParams);
          
                var options = {
                      /* for Staging */
                // hostname: 'securegw-stage.paytm.in',

                /* for Production */
                hostname: 'securegw.paytm.in',

                port: 443,
                path: '/v3/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };
          
            var response = "";
            var post_req = https.request(options, function (post_res) {
              post_res.on("data", function (chunk) {
                response += chunk;
              });
          
              post_res.on("end", function () {
                console.log("Response: ", response);
                return res.status(200).json({status: true, message: "Success", data: response});
              });
            });
          
            post_req.write(post_data);
            post_req.end();
          });

  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

module.exports = {
  deleteAchiver,
  getPayment,
  getPaymentStatus,
  getAchiver,
  updatechapter,
};
