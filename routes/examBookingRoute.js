const express= require("express")
const router= express.Router()
const examBookingController = require("../controllers/examBookingController")
const path = require('path');

//---------------------------------------------------- examBooking Api ----------------------------------------------------------//
router.post("/examBooking/addexamBooking",examBookingController.examBookingAdd)
router.post("/examBooking/getByExamBookingId", examBookingController.getBybookingExamId)
router.post("/examBooking/getExamBookingByUserId", examBookingController.getbookingByUserId)

router.post("/examBooking/getAllExambooking", examBookingController.getAllExambooking)
router.post("/examBooking/updateExambooking",examBookingController.updateExambooking)
router.delete('/examBooking/deleteExamBooking',examBookingController.deleteExamBooking)




module.exports = router;