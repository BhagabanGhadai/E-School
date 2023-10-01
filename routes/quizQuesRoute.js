const express= require("express")
const router= express.Router()
const quizQuesController = require("../controllers/quizQuesController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")

const path = require('path');



//---------------------------------------------------- Quiz Question Api ----------------------------------------------------------//
router.post('/quizQues/addQuestion', upload.single("questionImage"),quizQuesController.quizQuesAdd)
router.post("/quizQues/getById", quizQuesController.getquizQuesById)
router.post("/quizQues/getByQuizId", quizQuesController.getquizById)

router.post("/quizQues/getAll", quizQuesController.getAllQuizQues)
router.post("/quizQues/getByQuizSlug", quizQuesController.getByQuizSlug)
router.post("/quizQues/getResultByQuizSlug", quizQuesController.getResultByQuizSlug)


router.post("/quizQues/update",middleWare.validateToken,upload.single("questionImage"),quizQuesController.updateQuizQues)
router.delete('/quizQues/delete',middleWare.validateToken, quizQuesController.deleteQuizQues)

module.exports = router