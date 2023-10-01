
const express= require("express")
const router= express.Router()
const entranceController = require("../controllers/entranceController")



const path = require('path');

//---------------------------------------------------- Api ----------------------------------------------------------//
router.post("/entrance/addEntrance",entranceController.addEntrance)
router.post("/entrance/getById", entranceController.getEntranceById)
router.post("/entrance/getAll", entranceController.getAllEntrance)
router.post("/entrance/update",entranceController.updateEntrance)
router.delete('/entrance/delete', entranceController.deleteEntrance)

module.exports = router