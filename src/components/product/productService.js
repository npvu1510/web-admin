const productModel = require('./models/productModel');
const userModel = require('../user/userModel');
const orderModel = require('../order/orderModel');
const reviewModel = require('./models/reviewModel');
const cloudinary = require('../../config/cloudinary.config');


/**
 * Get all the products
 * @returns {Promise<productModel>}
 */
module.exports.getAllProducts = async () => {
    try {
        return await productModel.findById().lean();
    } catch (err) {
        throw err;
    }
}


/**
 * Get user the products
 * @param sort
 * @param category
 * @param brand
 * @param min
 * @param max
 * @param id {string||null}
 * @returns {Promise<productModel>}
 */
module.exports.getProducts = async (sort, category, brand, min, max, id = null) => {
    try {
        console.log("--- getProducts ---");
        console.log("sort:", sort);
        console.log("category:", category);
        console.log("brand:", brand);
        console.log("min:", min);
        console.log("max:", max);
        console.log("id:", id);


        if (id === null) {
            let products = null;
            if (sort === undefined) {
                // case get dashboard
                products = await productModel.find().lean();

                for (let i = 0; i < products.length; i++) {
                    products[i].thumbnail = products[i].img[0];
                }

                return products;
            } else if (sort !== 0) {
                if (sort === 2) {
                    console.log("sort by price asc")
                    products = await productModel.find({}).sort({ createdAt: 1 }).lean()
                }
                else if (sort === -2) {
                    console.log("sort by price desc")
                    products = await productModel.find({}).sort({ createdAt: -1 }).lean()
                }
                else if (!category && !brand)
                    products = await productModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] }).sort({ price: sort }).lean()

                else if (category && brand)
                    products = await productModel.find({ $and: [{ category: { "$in": category } }, { brand: { "$in": brand } }, { price: { $gte: min } }, { price: { $lte: max } }] }).sort({ price: sort }).lean()
                else if (category && !brand)
                    products = await productModel.find({ $and: [{ category: { "$in": category } }, { price: { $gte: min } }, { price: { $lte: max } }] }).sort({ price: sort }).lean()
                else
                    products = await productModel.find({ $and: [{ brand: { "$in": brand } }, { price: { $gte: min } }, { price: { $lte: max } }] }).sort({ price: sort }).lean()
            } else {
                console.log("sort = 0");
                if (!category && !brand)
                    products = await productModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] }).lean()
                else if (category && brand)
                    products = await productModel.find({ $and: [{ category: { "$in": category } }, { brand: { "$in": brand } }, { price: { $gte: min } }, { price: { $lte: max } }] }).lean()
                else if (category && !brand)
                    products = await productModel.find({ $and: [{ category: { "$in": category } }, { price: { $gte: min } }, { price: { $lte: max } }] }).lean()
                else
                    products = await productModel.find({ $and: [{ brand: { "$in": brand } }, { price: { $gte: min } }, { price: { $lte: max } }] }).lean()
            }

            for (let i = 0; i < products.length; i++) {
                products[i].thumbnail = products[i].img[0];
            }

            return products;
        } else {
            const product = await productModel.findById(id).lean();
            product.thumbnail = product.img[0];

            return product;
        }
    } catch (err) {
        throw err;
    }
}


/**
 * add new product
 * @param body {Object}
 * @param files {object}
 * @returns {Promise<void>}
 */
module.exports.addProduct = async (body, files) => {
    try {
        let url = [];
        for (let i = 0; i < files.length; i++) {
            url.push(await cloudinary.upload(files[i].path, 'product'));
        }

        console.log("req.body:", body);

        // body to model
        body['img'] = url;
        body['thumb'] = url[0];

        if (body.brand === "") {
            body['brand'] = "BoBui";
        }
        if (body.category === undefined) {
            body['category'] = "Clothing";
        }
        if (body.size === undefined) {
            body['size'] = ['XL', 'L', 'M', 'S'];
        }
        if (body.introduction === undefined) {
            body['introduction'] = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
        }

        if (body.infomation === undefined) {
            body['infomation'] = 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H.Rackham.';
        }


        if (body.color) {
            let variation = [];

            for (let i = 0; i < body.size.length; i++) {
                variation.push({
                    size: body.size[i],
                    color: body.color[i],
                    stock: body.stock[i],
                })
            }

            body['variation'] = variation;
        }


        body['createdAt'] = new Date();


        console.log("body:", body);

        // insert
        await productModel.insertMany(body)

    } catch (err) {
        throw err;
    }
}

// /**
//  * change product
//  * @param id {String}
//  * @param body {Object}
//  * @param files {Object}
//  * @param existFiles {object}
//  * @returns {Promise<void>}
//  */
// module.exports.changeProductInfo = async (body, files) => {
//     try {
//         console.log("-- change ---");
//         console.log("body:", body);
//         console.log("files:", files);
//         console.log("+__+");

//         let url = [];
//         for (let i = 0; i < files.length; i++) {
//             url.push(await cloudinary.upload(files[i].path, 'product'));
//         }

//         console.log("url:", url);

//         await productModel.findByIdAndUpdate({ _id: body.productID }, {
//             $set: {
//                 name: body.name,
//                 price: body.price,
//                 brand: body.brand,

//                 category: body.category,
//                 img: JSON.parse(body.img),
//                 SKU: body.SKU,
//                 introduction: body.introduction,
//                 infomation: body.infomation,
//                 variation: JSON.parse(body.variation)
//             }
//         });

//         console.log("done");
//     } catch (err) {
//         throw err;
//     }
// }

/**
 * change product
 * @param id {String}
 * @param body {Object}
 * @param files {Object}
 * @param existFiles {object}
 * @returns {Promise<void>}
 */
module.exports.changeProductInfo = async (id, body, files, existFiles) => {
    try {
        console.log("-- change v2---");
        console.log("body:", body);
        console.log("files:", files);
        console.log("+__+");

        let listImg = [];
        for (let i = 0; i < existFiles.length; i++) {
            listImg.push(existFiles[i]);
        }

        for (let i = 0; i < files.length; i++) {
            listImg.push(await cloudinary.upload(files[i].path, 'product'));
        }

        console.log("url:", listImg);
        console.log("body.variation:", body.variation);

        await productModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                name: body.name,
                price: body.price,
                brand: body.brand,
                size: body.size,
                color: body.color,
                category: body.category,
                img: listImg,
                SKU: body.SKU,
                introduction: body.introduction,
                infomation: body.infomation,
                variation: body.variation
            }
        });

        console.log("done");
    } catch (err) {
        throw err;
    }
}

/**
 * delete product, delete review, delete comment
 * @param id {String}
 * @returns {Promise<void>}
 */
module.exports.deleteProduct = async (id) => {
    try {
        // delete product
        await productModel.remove({ _id: id });

        // delete order has this product
        await orderModel.remove({ products: { product_id: id } });

        // delete comment has this product
        await reviewModel.remove({ productID: id });

        // delete user's cart has this product
        await userModel.updateMany({ productID: id }, {
            $pull: {
                cart: {
                    productID: id
                }
            }
        });
    } catch (err) {
        throw err;
    }
}