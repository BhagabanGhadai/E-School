const express= require("express")
const router= express.Router()
const batchController = require("../controllers/courseDetailsController")


const path = require('path');

//---------------------------------------------------- course Details Api ----------------------------------------------------------//
router.post("/courseDetails/getCourse",batchController.getCourseDetails)
router.post("/courseDetails/getCourseUser",batchController.getCourseUser)
router.post("/courseDetails/getCourseBySlug",batchController.getCourseDetailsBySlug)


router.post("/courseDetails/getCourseUserDetailsBySlug",batchController.getCourseUserDetailsBySlug)



module.exports = router;