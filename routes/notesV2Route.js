const express= require("express")
const router= express.Router()
const notesV2Controller = require("../controllers/notesV2Controller")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")


const path = require('path');

//---------------------------------------------------- Notes Api ----------------------------------------------------------//
router.post("/notesv2/addNotes",upload.single("pdf"),notesV2Controller.notesAdd)

router.post("/notesv2/getById", notesV2Controller.getnotesById)
router.post("/notesv2/getBySubjectId", notesV2Controller.getnotesBySubjectId)
router.post("/notesv2/getsubjectsByNotesId", notesV2Controller.getsubjectsByNotesId)


router.post("/notesv2/getAssignedNotesBySubjectId", notesV2Controller.getAssignedNotesBySubjectId)
router.post("/notesv2/getRemovedNotesBySubjectId", notesV2Controller.getRemovedNotesBySubjectId)

router.post("/mock/getAssignedMocksBySubjectId", notesV2Controller.getAssignedMocksBySubjectId)
router.post("/mock/getRemovedMocksBySubjectId", notesV2Controller.getRemovedMocksBySubjectId)



router.post("/notesv2/getAll", notesV2Controller.getAllnotes)
router.post("/notesv2/getAllSearch", notesV2Controller.getAllSearch)


router.post("/notesv2/update",middleWare.validateToken,upload.single("pdf"),notesV2Controller.updateNotes)
router.delete('/notesv2/delete',middleWare.validateToken, notesV2Controller.deleteNotes)




module.exports = router;