const productService = require('./productService');
const utils = require("../../public/js/paging");
/************************************* GET methods *************************************/
/**
 *  get product information list
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.renderProductManage = async (req, res) => {
    try {
        res.render("product/views/product", { layout: "/product/views/product_layout", active: { ProductManage: true }, page: "Product manage" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

/**
 *  render product edit page
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.renderProductDetailEdit = async (req, res) => {
    try {
        const product = await productService.getProducts(undefined, undefined, undefined, undefined, undefined, req.params.productID);
        console.log("reder detail");
        console.log("product:", product);

        res.render("product/views/product_detail", { active: { ProductManage: true, editProduct: true }, page: "Product detail/edit", product });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

/**
 *  get product information by id
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.renderProductDetail = async (req, res) => {
    try {
        const product = await productService.getProducts(undefined, undefined, undefined, undefined, undefined, req.params.productID);
        console.log("--get product detail - render: ", product);
        res.render("product/views/product_detail", { active: { ProductManage: true }, page: "Product detail", product });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

/************************************* GET methods *************************************/
/**
 *  add new product
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.addProduct = async (req, res) => {
    try {
        console.log("--- add product ----");
        console.log("body: ", req.body);

        await productService.addProduct(req.body, req.files);


        res.redirect('back');
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
};

/************************************* PUT methods *************************************/

/**
 *  edit product information
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.editProduct = async (req, res) => {
    try {
        console.log("--edit product: ------");
        console.log("id:", req.params.productID);
        console.log("body: ", req.body);
        console.log("files: ", req.files);
        console.log("exist:", req.body.exist_img);
        if (!Array.isArray(req.body.exist_img)) {
            req.body.exist_img = [req.body.exist_img];
        }

        req.body.variation = JSON.parse(req.body.variation)
        console.log(req.body)
        await productService.changeProductInfo(req.params.productID, req.body, req.files, req.body.exist_img);
        res.redirect('back');
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


/************************************* DELETE methods *************************************/
/**
 *  delete product by id
 *
 * @param req request
 * @param res response
 * @returns {Promise<void>}
 */
exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.productID);
        res.redirect('/product');
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

