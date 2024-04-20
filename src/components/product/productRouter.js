const router = require("express").Router();
const product_manageController = require("./productController");
const upload = require("../../config/multer.config");

/*************************** GET methods ***************************/
// render product
router.get("/", product_manageController.renderProductManage);

// render product detail
router.get("/:productID", product_manageController.renderProductDetail);

// render product edit
router.get("/edit/:productID", product_manageController.renderProductDetailEdit);

/*************************** POST methods ***************************/
// edit product
router.put("/edit/:productID", upload.array('img', 10), product_manageController.editProduct);

/*************************** PUT methods ***************************/
// add product
router.post("/add-product", upload.array('img'), product_manageController.addProduct);

// edit product
// router.post("/edit", upload.array('img'), product_manageController.edit);

/*************************** DELETE methods ***************************/
// delete product
router.delete("/edit/:productID", product_manageController.deleteProduct);

module.exports = router;