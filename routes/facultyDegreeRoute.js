const express= require("express")
const router= express.Router()
const facultyDegreeController = require("../controllers/facultyDegreeController")
const upload = require("../utils/multer");


const path = require('path');

//---------------------------------------------------- facultyDegree Api ----------------------------------------------------------//
router.post("/facultyDegree/addfacultyDegree",upload.single("image"),facultyDegreeController.addfacultyDegree)
router.post("/facultyDegree/getById", facultyDegreeController.getfacultyDegreeById)
router.post("/facultyDegree/getByFacultyId", facultyDegreeController.getByFacultyId)

router.post("/facultyDegree/getAll", facultyDegreeController.getAllfacultyDegree)
router.post("/facultyDegree/update",upload.single("image"),facultyDegreeController.updatefacultyDegree)
router.delete('/facultyDegree/delete',facultyDegreeController.deletefacultyDegree)




module.exports = router;

