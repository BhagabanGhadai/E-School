const express= require("express")
const router= express.Router()
const quizV2Controller = require("../controllers/quizV2Controller")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")


const path = require('path');

//---------------------------------------------------- Quiz Api ----------------------------------------------------------//
// router.post("/quiz/addQuiz",upload.single("image"),quizV2Controller.quizAdd)
router.post("/quiz/addQuiz",quizV2Controller.quizAdd)

router.post("/quiz/addPage",quizV2Controller.addPage)

router.delete('/quiz/deleteQuestionByPageId',quizV2Controller.deleteQuestionByPageId)



router.post("/quiz/getPagesById", quizV2Controller.getPagesById)
router.post("/quiz/getById", quizV2Controller.getquizById)


router.post("/quiz/getall", quizV2Controller.getAllQuiz)
router.post("/quiz/getByChapterSlug", quizV2Controller.getByChapterSlug)



router.post("/quiz/update",middleWare.validateToken, upload.single("image"),quizV2Controller.updateQuiz)
router.delete('/quiz/delete',middleWare.validateToken, quizV2Controller.deleteQuiz)

module.exports = router