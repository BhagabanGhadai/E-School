const express= require("express")
const router= express.Router()
const fingerprintController = require("../controllers/fingerprintController")



const path = require('path');

//---------------------------------------------------- Api ----------------------------------------------------------//
router.post("/fingerprint/addfingerprint",fingerprintController.addfingerprint)

router.post("/fingerprint/update",fingerprintController.fingerprintUpdate)
router.post("/fingerprint/getfingerprint",fingerprintController.getfingerprint)



module.exports = router