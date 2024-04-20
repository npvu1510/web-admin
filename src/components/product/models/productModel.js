const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const product = new Schema({
    name: String,
    price: Number,
    brand: String,
    size: [String],
    color: [String],
    category: String,
    img: [String],
    thumb: String,
    SKU: String,
    introduction: String,
    infomation: String,
    variation: [{
        size: String,
        color: String,
        stock: Number
    }],
    createdAt: Date

}, {
    versionKey: false
});

module.exports = mongoose.model('product', product, 'product');