const express= require("express")
const router= express.Router()
const exam_courseController = require("../controllers/exam_courseController")
const upload = require("../utils/multer");
const path = require('path');


//---------------------------------------------------- Exam Api ----------------------------------------------------------//
router.post('/examCourse/addExamCourse',upload.single("image"), exam_courseController.exam_CourseAdd)
router.post("/examCourse/getById", exam_courseController.getexamCourseById)
router.post("/examCourse/getAll", exam_courseController.getAllExamCourse )
router.post("/examCourse/getAllUser", exam_courseController.getAllUser )

router.post("/examCourse/update",upload.single("image"),exam_courseController.examCourseUpdate)
router.delete('/examCourse/delete', exam_courseController.deleteExamCourse)

module.exports = router