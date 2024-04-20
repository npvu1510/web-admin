const router = require("express").Router();
const user_manageController = require("./userController");
const promotion_manageController = require('../promotion/promotionController')
const upload = require("../../config/multer.config");
const { body } = require("express-validator");

/*************************** GET methods ***************************/
// render promotion manage page
router.get("/promotion", promotion_manageController.renderPromotionManage);

/*************************** POST methods ***************************/



/*************************** PUT methods ***************************/


module.exports = router;