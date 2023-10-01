const express= require("express")
const router= express.Router()
const adminController = require("../controllers/adminController")



//---------------------------------------------------- admin Api ----------------------------------------------------------//
router.post('/admin/register', adminController.createadmin)

router.post("/admin/login", adminController.loginadmin)





module.exports = router;