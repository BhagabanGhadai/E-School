const express= require("express")
const router= express.Router()
const paymentController = require("../controllers/paymentController")


//---------------------------------------------------- payment Api ----------------------------------------------------------//
router.post("/payment/getPayment", paymentController.getPayment)
router.post("/payment/getPaymentStatus", paymentController.getPaymentStatus)





module.exports = router;