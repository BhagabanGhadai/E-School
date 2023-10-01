const express= require("express")
const router= express.Router()
const notificationController = require("../controllers/notificationController")
const upload = require("../utils/multer");

//---------------------------------------------------- notification Api ----------------------------------------------------------//
router.post("/notification/addnotification",upload.single("image"),notificationController.addnotification)
router.post("/notification/getById", notificationController.getnotificationById)
router.post("/notification/getAll", notificationController.getAllnotification)
router.post("/notification/update",upload.single("image"),notificationController.updatenotification)
router.delete('/notification/delete',notificationController.deletenotification)




module.exports = router;








