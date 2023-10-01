const express= require("express")
const router= express.Router()
const courseBatchController = require("../controllers/courseBatchController")



const path = require('path');

//---------------------------------------------------- course Batch Api ----------------------------------------------------------//
router.post("/courseBatch/addcourseBatch",courseBatchController.addBatchCourse)
router.post("/courseBatch/getById", courseBatchController.getcourseBatchById)
router.post("/courseBatchV2/getById", courseBatchController.getcourseBatchByIdV2)

router.post("/courseBatch/getall", courseBatchController.getAllcourseBatch)
router.post("/courseBatch/update",courseBatchController.updatecourseBatch)
router.post("/courseBatchV2/update",courseBatchController.updatecourseBatchV2)

router.delete('/courseBatch/delete', courseBatchController.deletecourseBatch)


module.exports = router