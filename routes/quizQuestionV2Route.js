const express= require("express")
const router= express.Router()
const quizQuestionV2Controller = require("../controllers/quizQuestionV2Controller")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")

const path = require('path');



//---------------------------------------------------- Quiz Question Api ----------------------------------------------------------//
// router.post('/quizQuestion/addQuestion',quizQuestionV2Controller.quizQuesAdd)
router.post('/quizQuestion/updateQuestion',quizQuestionV2Controller.quizQuesAdd)

router.post('/quizQuestion/addQuestionv2',quizQuestionV2Controller.quizQuesAddv2);

// router.post('/quizQuestion/addQuestion', upload.single("questionImage"),quizQuestionV2Controller.quizQuesAdd)

router.post("/quizQuestion/getById", quizQuestionV2Controller.getquizQuesById)
router.post("/quizQuestion/getByQuizId", quizQuestionV2Controller.getquizById)

router.post("/quizQuestion/getAll", quizQuestionV2Controller.getAllQuizQues)
router.post("/quizQuestion/getByQuizSlug", quizQuestionV2Controller.getByQuizSlug)
router.post("/quizQuestion/getResultByQuizSlug", quizQuestionV2Controller.getResultByQuizSlug)


router.post("/quizQuestion/update",middleWare.validateToken,upload.single("questionImage"),quizQuestionV2Controller.updateQuizQues)
router.delete('/quizQuestion/delete',middleWare.validateToken, quizQuestionV2Controller.deleteQuizQues)

module.exports = router