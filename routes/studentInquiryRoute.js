const express= require("express")
const router= express.Router()
const studentInquiryController = require("../controllers/studentInquiryController")



//---------------------------------------------------- User Api ----------------------------------------------------------//
router.post('/studentInquiry/register', studentInquiryController.createSudentInquiry)

router.post("/studentInquiry/getAllInquiry", studentInquiryController.getAllInquiry)




module.exports = router;