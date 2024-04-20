const router = require("express").Router();
const user_manageController = require("./userController");
const promotion_manageController = require('../promotion/promotionController')
const upload = require("../../config/multer.config");
const { body } = require("express-validator");

/*************************** GET methods ***************************/
// render admin
router.get("/admin", user_manageController.renderAdminManage);
// render user
router.get("/user", user_manageController.renderUserManage);
// render promotion
router.get("/promotion", promotion_manageController.renderPromotionManage);

router.post('/promotion/add', promotion_manageController.addPromotion)

router.post("/promotion/edit", promotion_manageController.editPromotion);

router.post("/promotion/delete", promotion_manageController.deletePromotion);

/*************************** PUT methods ***************************/
// change user role
router.put("/edit/:userID", user_manageController.editUser);

/*************************** DELETE methods ***************************/
// delete user
router.delete("/edit/:userID", user_manageController.deleteUser);



module.exports = router;