const express= require("express")
const router= express.Router()
const addressController = require("../controllers/addressController")


//---------------------------------------------------- address Api ----------------------------------------------------------//
router.post("/address/addaddress",addressController.addaddress)
router.post("/address/getById", addressController.getaddressById)
router.post("/address/getall", addressController.getAlladdress)
router.post("/address/update",addressController.updateaddress)
router.delete('/address/delete', addressController.deleteaddress)

module.exports = router