const router = require('express').Router();
const dashboardApiController = require("./dashboardApiController")

router.get('/', dashboardApiController.getDashboard);

module.exports = router;