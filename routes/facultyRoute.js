const express= require("express")
const router= express.Router()
const facultyController = require("../controllers/facultyController")
const upload = require("../utils/multer");

const path = require('path');

//---------------------------------------------------- faculty Api ----------------------------------------------------------//
router.post("/faculty/addfaculty",upload.single("image"),facultyController.facultyAdd)
router.post("/faculty/getById", facultyController.getfacultyById)
router.post("/faculty/getAll", facultyController.getfaculty)
router.post("/faculty/update",upload.single("image"),facultyController.updatefaculty)
router.delete('/faculty/delete',facultyController.deletefaculty)

module.exports = router;