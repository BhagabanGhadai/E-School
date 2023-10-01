const express= require("express")
const router= express.Router()
const chapterV2Controller = require("../controllers/chapterV2Controller")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")

const path = require('path');

//---------------------------------------------------- Chapter Api ----------------------------------------------------------//
router.post("/chapter/addChapterv2",upload.single("image"),chapterV2Controller.chapterAdd)
router.post("/chapter/getByIdV2", chapterV2Controller.getchapterById)
router.post("/chapter/getAll", chapterV2Controller.getchapter)
router.post("/chapter/getAllV2", chapterV2Controller.getchapterV2)
router.post("/chapter/getAllSearch", chapterV2Controller.getAllSearch)

router.post("/chapter/getCoursesByChapterId", chapterV2Controller.getCoursesByChapterId)

router.post(
  "/chapter/getAssignedByCourseId",
  chapterV2Controller.getAssignedByCourseId
);

router.post(
  "/chapter/getRemovedByCourseId",
  chapterV2Controller.getRemovedByCourseId
);



router.post("/chapter/getBySlug", chapterV2Controller.getBySlug)
router.post("/chapter/updateManyShowCase", chapterV2Controller.updateManyShowCase)
router.post("/chapterv2/update",middleWare.validateToken,upload.single("image"),chapterV2Controller.updatechapter)
router.delete('/chapterv2/delete', middleWare.validateToken,chapterV2Controller.deleteChapter)




module.exports = router;