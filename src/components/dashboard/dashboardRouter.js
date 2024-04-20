const router = require("express").Router();
const dashboardController = require("./dashboardController");

/*************************** GET methods ***************************/
//render dashboard
router.get("/", dashboardController.renderDashboard);

module.exports = router;