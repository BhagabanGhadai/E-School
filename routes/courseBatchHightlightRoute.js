const express= require("express")
const router= express.Router()
const courseBatchHightlightController = require("../controllers/courseBatchHighlightController")


//---------------------------------------------------- courseBatchHightlight Api ----------------------------------------------------------//
router.post('/courseBatchHightlight/addcourseBatchHightlight', courseBatchHightlightController.addcourseBatchHightlight)
router.post("/courseBatchHightlight/getById", courseBatchHightlightController.getcourseBatchHightlightById)
router.post("/courseBatchHightlight/getAll", courseBatchHightlightController.getAllcourseBatchHightlight)
router.post("/courseBatchHightlight/update",courseBatchHightlightController.updatecourseBatchHightlight)
router.delete('/courseBatchHightlight/delete', courseBatchHightlightController.deletecourseBatchHightlight)

module.exports = router