const express= require("express")
const router= express.Router()
const mockCourseController = require("../controllers/mockCourseController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")


const path = require('path');

//---------------------------------------------------- Notes Api ----------------------------------------------------------//
router.post("/mockCourse/addMockCourse",mockCourseController.addMockCourse)
router.post("/mockCourse/removeMockCourse",mockCourseController.removeMockCourse)
router.post(
  "/mockCourse/updateMockSequence",
  mockCourseController.updateMockSequence
);

router.post("/mockCourse/getAssignedMocksByCourseId", mockCourseController.getAssignedMocksByCourseId)
router.post("/mockCourse/getRemovedMocksByCourseId", mockCourseController.getRemovedMocksByCourseId)


// router.post("/courseSubject/getById", mockCourseController.getById)
// router.post("/courseSubject/getAll", mockCourseController.getAll)

// router.post("/courseSubject/update",middleWare.validateToken,mockCourseController.updateNotes)
// router.delete('/courseSubject/delete',middleWare.validateToken, mockCourseController.deleteNotes)




module.exports = router;