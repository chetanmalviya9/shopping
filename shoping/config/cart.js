const mongoose = require("mongoose");

const CartData = new mongoose.Schema({

    ProductList: {
        type: [String],
    },
});

const User = mongoose.model("Cart", CartData);

module.exports = User;
