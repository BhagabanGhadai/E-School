const express= require("express")
const router= express.Router()
const courseController = require("../controllers/courseController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")

const path = require('path');

//---------------------------------------------------- Course Api ----------------------------------------------------------//
router.post("/course/addcourse",upload.single("thumbnail"),courseController.courseAdd)

router.post("/course/getById", courseController.getcourseById )
router.post("/course/getByUserId", courseController.getByUserId )

router.post("/course/getAll", courseController.getcourse)
router.post("/course/getBySlug", courseController.getcourseSlug)
router.post("/course/getBySlugUser", courseController.getBySlugUser)
router.post("/course/getcourseVideoDetails", courseController.getcourseVideoDetails)





router.post("/course/getAllByAdmin", courseController.getAllByAdmin)

router.post("/course/update",middleWare.validateToken,upload.single("thumbnail"),courseController.updateCourse)
router.delete('/course/delete',middleWare.validateToken, courseController.deleteCourse)

module.exports = router;

