const express= require("express")
const router= express.Router()
const userController = require("../controllers/userController")
const upload = require("../utils/multer");

const path = require('path');




//---------------------------------------------------- User Api ----------------------------------------------------------//
router.post('/register', userController.createUser)
router.post("/getUser", userController.getUser)
router.post("/getAllUser", userController.getAlluser)

router.post("/updateUser", userController.updateUser)
router.post("/login", userController.loginUser);
router.post("/loginAdmin", userController.loginUserAdmin);

router.post("/loginv2", userController.loginUserV2);
router.post("/checkTokenMac", userController.checkTokenMac);
router.post("/checkUserStatus", userController.checkUserStatus);
router.post("/updateUserStatus", userController.updateUserStatus);
router.post("/updateUserKycStatus",upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "kyc_document", maxCount: 1 },
  ]), userController.updateUserKycStatus);
// router.post("/updateUserKycDoc",upload.single("kyc_document"), userController.updateUserKycDoc);
router.post("/checkUserKycStatus", userController.checkUserKycStatus);

router.post("/updateManyStatus", userController.updateManyStatus);

router.post("/deleteFingerPrint", userController.deleteFingerPrint);


router.post("/updateForceLogoutStatus", userController.updateForceLogoutStatus);
router.post("/updateKycStatus", userController.updateKycStatus);









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