const express= require("express")
const router= express.Router()
const getInTouchController = require("../controllers/getInTouchController")



const path = require('path');

//---------------------------------------------------- Api ----------------------------------------------------------//
router.post("/getInTouch/addgetInTouch",getInTouchController.createGetInTouch)
router.post("/getInTouch/getById", getInTouchController.getTouchInById)
router.post("/getInTouch/getAll", getInTouchController.getAll)
router.post("/getInTouch/update",getInTouchController.update)
router.delete('/getInTouch/delete', getInTouchController.deleteGetInTouch)

module.exports = router