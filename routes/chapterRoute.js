const express= require("express")
const router= express.Router()
const chapterController = require("../controllers/chapterController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")

const path = require('path');

//---------------------------------------------------- Chapter Api ----------------------------------------------------------//
router.post("/course/addChapter",upload.single("image"),chapterController.chapterAdd)
router.post("/chapter/getById", chapterController.getchapterById)
router.post("/chapter/getAll", chapterController.getchapter)
router.post("/chapter/getBySlug", chapterController.getBySlug)
router.post("/chapter/updateManyShowCase", chapterController.updateManyShowCase)
router.post("/chapter/update",middleWare.validateToken,upload.single("image"),chapterController.updatechapter)
router.delete('/chapter/delete', middleWare.validateToken,chapterController.deleteChapter)




module.exports = router;