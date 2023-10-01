const express= require("express")
const router= express.Router()
const courseSubjectController = require("../controllers/courseSubjectController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")


const path = require('path');

//---------------------------------------------------- Notes Api ----------------------------------------------------------//
router.post("/courseSubject/addCourseSubject",courseSubjectController.addCourseSubject)
router.post("/courseSubject/removeCourseSubject",courseSubjectController.removeCourseSubject)
router.post("/courseSubject/updateSubjectSequence",courseSubjectController.updateSubjectSequence)



// router.post("/courseSubject/getById", courseSubjectController.getById)
// router.post("/courseSubject/getAll", courseSubjectController.getAll)

// router.post("/courseSubject/update",middleWare.validateToken,courseSubjectController.updateNotes)
// router.delete('/courseSubject/delete',middleWare.validateToken, courseSubjectController.deleteNotes)




module.exports = router;