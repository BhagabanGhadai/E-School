const express= require("express")
const router= express.Router()
const newsLetterController = require("../controllers/newsLetterController")



const path = require('path');

//---------------------------------------------------- News Letter Api ----------------------------------------------------------//
router.post("/newsletter/addnewsletter",newsLetterController.registerEmail)
router.post("/newsletter/getById", newsLetterController.getEmailById)
router.post("/newsletter/getAll", newsLetterController.getAllNewsLetter)
router.post("/newsletter/update",newsLetterController.updateGmail)
router.delete('/newsletter/delete', newsLetterController.deleteGmail)

module.exports = router