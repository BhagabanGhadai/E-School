const express= require("express")
const router= express.Router()
const achiversController = require("../controllers/achiversController")
const upload = require("../utils/multer");
const middleWare = require("../middleWare/auth")

const path = require('path');

//---------------------------------------------------- achivers Api ----------------------------------------------------------//
router.post("/achivers/addAchiver",upload.single("image"),achiversController.addAchivers)
router.post("/achivers/getById", achiversController.getAchiverById)
router.post("/achivers/getAll", achiversController.getAchiver)
router.post("/achivers/update",upload.single("image"),achiversController.updatechapter)
router.delete('/achivers/delete',achiversController.deleteAchiver)




module.exports = router;