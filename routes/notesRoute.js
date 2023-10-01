const express= require("express")
const router= express.Router()
const notesController = require("../controllers/notesController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")


const path = require('path');

//---------------------------------------------------- Notes Api ----------------------------------------------------------//
router.post("/notes/addNotes",upload.single("pdf"),notesController.notesAdd)

router.post("/notes/getById", notesController.getnotesById)
router.post("/notes/getAll", notesController.getAllnotes)

router.post("/notes/update",middleWare.validateToken,upload.single("pdf"),notesController.updateNotes)
router.delete('/notes/delete',middleWare.validateToken, notesController.deleteNotes)




module.exports = router;