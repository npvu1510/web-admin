const productService = require('../../components/product/productService');
const pagination = require('../../public/js/paging');

module.exports.getProducts = async (req, res) => {
    try {
        console.log("get product");
        const page = parseInt(req.query.page || 1);
        const category = JSON.parse(req.query.category) || ['Bags', 'Accessories', 'Shoes', 'Clothing'];
        const brand = JSON.parse(req.query.brand);



        console.log("category:", category);
        console.log("brand:", brand);
        console.log("page:", page);


        const product = await productService.getProducts(parseInt(req.query.sort), category, brand, parseFloat(req.query.min), parseFloat(req.query.max));
        const result = pagination.paging(product, page, 10);
        res.send({ result });
    } catch (error) {
        res.status(500).send({ message: 'Error in the request' });
    }
}

module.exports.getProductsByID = async (req, res) => {
    try {
        const product = await productService.getProducts(null, null, null, null, null, req.query.productID)
        res.send({ product: product })
    }
    catch (e) {
        res.status(500).send({ message: e.message });
    }
}
