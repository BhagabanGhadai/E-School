const express= require("express")
const router= express.Router()
const noteSubjectController = require("../controllers/noteSubjectController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")


const path = require('path');

//---------------------------------------------------- Notes Api ----------------------------------------------------------//
router.post("/noteSubject/addNoteSubject",noteSubjectController.addNoteSubject)
router.post("/noteSubject/removeNoteSubject",noteSubjectController.removeNoteSubject)
router.post(
  "/noteSubject/updateNoteSequence",
  noteSubjectController.updateNoteSequence
);


// router.post("/courseSubject/getById", noteSubjectController.getById)
// router.post("/courseSubject/getAll", noteSubjectController.getAll)

// router.post("/courseSubject/update",middleWare.validateToken,noteSubjectController.updateNotes)
// router.delete('/courseSubject/delete',middleWare.validateToken, noteSubjectController.deleteNotes)




module.exports = router;