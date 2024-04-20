const router = require('express').Router();
const promotionApiController = require('./promotionApiController')


router.get('/', promotionApiController.getInfoPromotion);


module.exports = router;