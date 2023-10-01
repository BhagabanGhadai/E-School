
const express= require("express")
const router= express.Router()
const examResultController = require("../controllers/examResultController")


//---------------------------------------------------- exam Result Api ----------------------------------------------------------//
router.post('/examResult/AddquizResultBySlug', examResultController.examResultAdd)

module.exports = router;
