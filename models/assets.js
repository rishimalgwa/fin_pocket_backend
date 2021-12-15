const mongoose = require("mongoose");

const assets = mongoose.Schema({
    buy_price:Number,
    quantity:Number,
    name:String,
    date_of_purchase :Date,
    symbol: String,
    last_checked_price:Number,
})

module.exports = assets;