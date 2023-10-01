const express= require("express")
const router= express.Router()
const previousYearController = require("../controllers/previousYearController")
const upload = require("../utils/multer");



const path = require('path');

//---------------------------------------------------- previousYear Api ----------------------------------------------------------//
router.post("/previousYear/addpreviousYear",upload.single("image"),previousYearController.addpreviousYear)

router.post("/previousYear/getById", previousYearController.getpreviousYearById)
router.post("/previousYear/getAll", previousYearController.getAllpreviousYear)

router.post("/previousYear/update",upload.single("image"),previousYearController.updatepreviousYear)
router.delete('/previousYear/delete', previousYearController.deletepreviousYear)




module.exports = router;