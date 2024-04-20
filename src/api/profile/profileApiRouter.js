const router = require('express').Router();
const profileApiController = require('./profileApiController')
const {body} = require("express-validator");


router.get('/info', profileApiController.getInfo);
router.post('/edit-info', profileApiController.editInfo);
router.post('/change-password',
    body("new_passwd").isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
    body("new_passwd").isLength({ max: 20 }).withMessage("Password must be less than 20 characters long"),
    profileApiController.changePassword);

module.exports = router;