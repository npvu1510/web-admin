const router = require('express').Router();
const productController = require('./productApiController');

router.get('/', productController.getProducts);

router.get('/get', productController.getProductsByID);

module.exports = router;