const express= require("express")
const router= express.Router()
const quizController = require("../controllers/quizController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")


const path = require('path');

//---------------------------------------------------- Quiz Api ----------------------------------------------------------//
router.post("/quiz/addQuiz",upload.single("image"),quizController.quizAdd)
router.post("/quiz/getById", quizController.getquizById)

router.post("/quiz/getall", quizController.getAllQuiz)
router.post("/quiz/getByChapterSlug", quizController.getByChapterSlug)



router.post("/quiz/update",middleWare.validateToken, upload.single("image"),quizController.updateQuiz)
router.delete('/quiz/delete',middleWare.validateToken, quizController.deleteQuiz)

module.exports = router