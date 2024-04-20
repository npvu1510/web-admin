const router = require('express').Router();
const userApiController = require('./userApiController')

router.get('/admin', userApiController.getInfOfAdminByFilter);
router.get('/user', userApiController.getInfOfUserByFilter);
router.get('/search-user', userApiController.SearchUserByNameAndGmail);
router.get('/search-admin', userApiController.SearchAdminByNameAndGmail);

module.exports = router;