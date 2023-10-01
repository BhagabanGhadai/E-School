const express= require("express")
const router= express.Router()
const examAnswerController = require("../controllers/examAnswerController")


//---------------------------------------------------- Exam Question Api ----------------------------------------------------------//
router.post('/examAnswer/addExamAnswer', examAnswerController.examAnsAdd)
router.post("/examAnswer/getById", examAnswerController.getexamAnsById)
router.post("/examAnswer/getByQuesId", examAnswerController.getExamQuestionById)

router.post("/examAnswer/getAll", examAnswerController.getAllExamAnswer)
router.post("/examAnswer/update",examAnswerController.updateExamAns)
router.delete('/examAnswer/delete', examAnswerController.deleteExamAns)

module.exports = router