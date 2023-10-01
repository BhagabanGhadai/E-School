const express= require("express")
const router= express.Router()
const testinomialController = require("../controllers/testinomialController")
const upload = require("../utils/multer");


const path = require('path');

//---------------------------------------------------- testinomialApi ----------------------------------------------------------//
router.post("/testinomial/addtestinomial",upload.single("image"),testinomialController.addTestinomial)
router.post("/testinomial/getById", testinomialController.getTestinomialById)
router.post("/testinomial/getAll", testinomialController.getAllTestinomial)
router.post("/testinomial/update",upload.single("image"),testinomialController.updateTestinomial)
router.delete('/testinomial/delete',testinomialController.deleteTestinomial)




module.exports = router;