const express= require("express")
const router= express.Router()
const examController = require("../controllers/examController")


//---------------------------------------------------- Exam Api ----------------------------------------------------------//
router.post('/exam/addExam', examController.addExam)
router.post("/exam/getById", examController.getExamById)
router.post("/exam/getAll", examController.getAllExam)
router.post("/exam/update",examController.updateExam)
router.delete('/exam/delete', examController.deleteExam)

module.exports = router