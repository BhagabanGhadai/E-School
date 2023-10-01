const express= require("express")
const router= express.Router()
const previousYearQuestionController = require("../controllers/previousYearQuestionController")
const upload = require("../utils/multer");



const path = require('path');

//---------------------------------------------------- previousYearQuestion Api ----------------------------------------------------------//
router.post("/previousYearQuestion/addpreviousYearQuestion",upload.single("pdf"),previousYearQuestionController.previousYearQuestionAdd)

router.post("/previousYearQuestion/getById", previousYearQuestionController.getpreviousYearQuestionById)
router.post("/previousYearQuestion/getAll", previousYearQuestionController.getAllpreviousYearQuestion)

router.post("/previousYearQuestion/update",upload.single("pdf"),previousYearQuestionController.updatepreviousYearQuestion)
router.delete('/previousYearQuestion/delete', previousYearQuestionController.deletepreviousYearQuestion)





module.exports = router;