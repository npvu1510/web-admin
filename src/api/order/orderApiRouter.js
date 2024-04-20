const router = require('express').Router();
const orderApiController = require('./orderApiController');
const orderController = require("../../components/order/orderController");

router.get('/', orderApiController.getOrders);

router.get('/get-by-id', orderApiController.getOrdersByID);

//update status
router.post("/update", orderApiController.updateOrderStatus);

module.exports = router;