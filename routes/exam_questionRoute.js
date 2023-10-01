const express= require("express")
const router= express.Router()
const exam_questionController = require("../controllers/exam_questionController")
const upload = require("../utils/multer");



//---------------------------------------------------- Exam Question Api ----------------------------------------------------------//
router.post('/examQuestion/addExamQuestion',upload.single("questionImage"), exam_questionController.addExamQuestion)
router.post("/examQuestion/getById", exam_questionController.getExamQuestionById)
router.post("/examQuestion/getByExamId", exam_questionController.getByExamId)

router.post("/examQuestion/getAll", exam_questionController.getAllExam_question)
router.post("/examQuestion/getByexamSlug", exam_questionController.getByexamSlug)
router.post("/examQuestion/getResultByexamSlug", exam_questionController.getResultByexamSlug)

router.post("/examQuestion/update",upload.single("questionImage"),exam_questionController.updateExam_question)
router.delete('/examQuestion/delete', exam_questionController.deleteExam_question)

module.exports = router