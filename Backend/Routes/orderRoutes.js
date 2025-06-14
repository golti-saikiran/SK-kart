const router = require('express').Router();
const orderController = require('../Controllers/orderControllers')

router.get('/getallorders', orderController.getAllOrders);

router.get('/getorderbyuserid/:userId', orderController.getOrderByUserId);

router.post('/placeneworder', orderController.placeNewOrder);

router.delete('/deleteorder/:id', orderController.deleteOrderById);

router.put('/updateorder/:id', orderController.updateOrderById);

router.get('/searchorders', orderController.searchOrder);

module.exports = router