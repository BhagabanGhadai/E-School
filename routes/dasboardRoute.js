
const express= require("express")
const router= express.Router()
const dasboardController = require("../controllers/dasboardController")



const path = require('path');

//---------------------------------------------------- Api ----------------------------------------------------------//
router.post("/dasboard/adddasboard",dasboardController.dashboard)


module.exports = router