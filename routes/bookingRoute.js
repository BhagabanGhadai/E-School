const express= require("express")
const router= express.Router()
const bookingController = require("../controllers/bookingController")
const path = require('path');

//---------------------------------------------------- booking Api ----------------------------------------------------------//
router.post("/course/addbooking",bookingController.bookingAdd)
router.post("/booking/getByUserId", bookingController.getbookingByUserId)

router.post("/booking/getAll", bookingController.getAllbooking)
router.post("/booking/getAllEnrollUsers", bookingController.getAllEnrollUsers)
router.post("/booking/enrollCourseOfUser", bookingController.enrollCourseOfUser)

router.post("/booking/getAllUsers", bookingController.getAllUsers)



router.post("/booking/getByBookingId", bookingController.getbookingId)
router.post("/booking/update",bookingController.updatebooking)
router.delete('/booking/delete',bookingController.deletebooking)




module.exports = router;