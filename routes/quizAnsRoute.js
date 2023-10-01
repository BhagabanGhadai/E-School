const express= require("express")
const router= express.Router()
const quizAnsController = require("../controllers/quizAnsController")
const middleWare = require("../middleWare/auth")




//---------------------------------------------------- Quiz Ans Api ----------------------------------------------------------//
router.post('/quizAnswer/addQuizAns', quizAnsController.quizAnsAdd)
router.post("/quizAns/getById", quizAnsController.getquizAnsById)
router.post("/quizAns/getAll", quizAnsController.getAllQuizAns)
router.post("/quizAns/update",middleWare.validateToken,quizAnsController.updateQuizAns)
router.delete('/quizAns/delete', middleWare.validateToken,quizAnsController.deleteQuizAns)

module.exports = router