const mongoose = require("mongoose");

const ProductData = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
});

const User = mongoose.model("Product", ProductData);

module.exports = User;
