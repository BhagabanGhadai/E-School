const express= require("express")
const router= express.Router()
const userController = require("../controllers/userController")
const userModel = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");


// const upload = require("../utils/multer");
const multer = require("multer");

const path = require('path');
// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads"); // Specify the directory where files will be stored
    },
    filename: (req, file, cb) => {
      // Use a unique name for the file to prevent overwriting
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + ".png"); // You can change the file extension as needed
    },
  });
  
const upload = multer({ storage: storage });

router.post(
    "/addKyc",
    upload.fields([
      { name: "profile_photo", maxCount: 1 },
      { name: "kyc_document", maxCount: 1 },
    ]),
    async (req, res) => {
  
      const profile_photo = req.files["profile_photo"][0];
      const kyc_document = req.files["kyc_document"][0];
  
        const {
          user_id,
          birthday,
          father_name,
          father_occupation,
          present_address,
          current_occupation,
          other_occupation,
          reference,
          others,
          document_type,
        } = req.body;
  
        try {
          const user = await userModel.findOne({ _id: user_id.toString() });
          if (user) {
            const update_data = {
              birthday,
              father_name,
              father_occupation,
              present_address,
              current_occupation,
              other_occupation,
              reference,
              others,
              document_type,
              kyc_status: 1,
            };
            // upload profile photo to cloudinary
            const upload_photo = await cloudinary.uploader.upload(profile_photo.path, {
              folder: "mankantlaweducation/profilePhoto",
            });
  
            update_data.profile_photo = upload_photo.secure_url;
  
            // upload kyc document to cloudinary
            const upload_doc = await cloudinary.uploader.upload(kyc_document.path, {
              folder: "mankantlaweducation/kycDocument",
            });
            update_data.kyc_document = upload_doc.secure_url;
  
            await userModel.findByIdAndUpdate(
              user._id,
              {
                $set: update_data,
              },
              { new: true }
            );
  
            return res.status(200).json({
              msg: "Kyc Data updated successfully",
              status: 200,
            });
          } else {
            return res
              .status(400)
              .json({ message: "User doesnot exists!", status: 400 });
          }
        } catch (err) {
          res.status(500).send({ status: false, message: err.message });
        }
    }
  );





//---------------------------------------------------- User Api ----------------------------------------------------------//
router.post('/register', userController.createUser)
router.post("/getUser", userController.getUser)
router.post("/getAllUser", userController.getAlluser)

router.post("/updateUser", userController.updateUser)
router.post("/login", userController.loginUser);
router.post("/loginv2", userController.loginUserV2);
router.post("/checkTokenMac", userController.checkTokenMac);
router.post("/checkUserStatus", userController.checkUserStatus);
router.post("/updateUserStatus", userController.updateUserStatus);
// router.post("/updateUserKycStatus",upload.single("profile_photo"), userController.updateUserKycStatus);
// router.post("/updateUserKycDoc",upload.single("kyc_document"), userController.updateUserKycDoc);
router.post("/checkUserKycStatus", userController.checkUserKycStatus);




router.post("/loginWithMobile", userController.loginUserWithMobile);
router.post("/verifyOtpLogin", userController.verifyOtpLogin);

router.post("/forgetPassword", userController.forgetPassword)
router.post("/updatePersonalInformation", userController.updatePersonalInformation)


router.post("/genotp/:email", userController.generateOtp)
// router.post("/verifyOtp/:email", userController.verifyOtp)
router.post("/verifyOtp", userController.verifyOtp)
router.post("/forgotSendOtp", userController.forgotSendOtp)
router.post("/forgotVerifyOtp", userController.forgotVerifyOtp)
router.post("/forgotUpdatePassword", userController.forgotUpdatePassword)
router.post("/smsTest", userController.smsTest)









module.exports = router;