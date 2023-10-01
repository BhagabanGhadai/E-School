const express= require("express")
const router= express.Router()
const faqController = require("../controllers/faqController")



const path = require('path');

//---------------------------------------------------- faq Api ----------------------------------------------------------//
router.post("/faq/addfaq",faqController.addFaq)
router.post("/faq/getById", faqController.getfaqById)
router.post("/faq/getall", faqController.getAllfaq)

router.post("/faq/update",faqController.updatefaq)
router.delete('/faq/delete', faqController.deletefaq)

module.exports = router