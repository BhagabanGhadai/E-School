const express= require("express")
const router= express.Router()
const whyMankavitController = require("../controllers/whyMankavitController")



const path = require('path');

//---------------------------------------------------- Mankavit Api ----------------------------------------------------------//
router.post("/mankavit/addMankavit",whyMankavitController.addWhyMankavit)
router.post("/mankavit/getById", whyMankavitController.getMankavitById)
router.post("/mankavit/getall", whyMankavitController.getAllMankavit)
router.post("/mankavit/update",whyMankavitController.updateMankavit)
router.delete('/mankavit/delete', whyMankavitController.deleteMankavit)

module.exports = router