
const express= require("express")
const router= express.Router()
const quizResultController = require("../controllers/quizResultController")


//---------------------------------------------------- Quiz Result Api ----------------------------------------------------------//
router.post('/quizResult/AddquizResultBySlug', quizResultController.quizResultAdd)
router.post("/quizResult/getByResultId", quizResultController.getquizResultById)
router.post("/quizResult/updateResult", quizResultController.updatequizResult)
router.delete("/quizResult/deleteResult", quizResultController.deleteQuizResult)
router.post("/quizResult/totalMarks", quizResultController.totalMarks)
router.post("/quizResult/totalMarksByQuizSlug", quizResultController.totalMarksByQuizSlug)
router.post('/quizResult/quizDetails', quizResultController.quizDetails)

router.post("/quizResult/answerCheck", quizResultController.answerCheck)





module.exports = router