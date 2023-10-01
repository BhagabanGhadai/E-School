const express= require("express")
const router= express.Router()
const mockSubjectController = require("../controllers/mockSubjectController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")


const path = require('path');

//---------------------------------------------------- Notes Api ----------------------------------------------------------//
router.post("/mockSubject/addMockSubject",mockSubjectController.addMockSubject)
router.post("/mockSubject/removeMockSubject",mockSubjectController.removeMockSubject)
router.post(
  "/mockSubject/updateMockSequence",
  mockSubjectController.updateMockSequence
);


// router.post("/courseSubject/getById", mockSubjectController.getById)
// router.post("/courseSubject/getAll", mockSubjectController.getAll)

// router.post("/courseSubject/update",middleWare.validateToken,mockSubjectController.updateNotes)
// router.delete('/courseSubject/delete',middleWare.validateToken, mockSubjectController.deleteNotes)




module.exports = router;