const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * Schema
 */
const review = new Schema({
    fullname: String,
    productID: String,
    content: String,
    createdAt: Date
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model("review", review, "review");