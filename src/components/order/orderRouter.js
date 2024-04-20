const router = require("express").Router();
const orderController = require("./orderController");

/*************************** GET methods ***************************/
//render order
router.get("/", orderController.renderOrder);


module.exports = router;