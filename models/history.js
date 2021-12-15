const mongoose = require("mongoose");

const history = mongoose.Schema({
    buy_price:Number,
    quantity:Number,
    name:String,
    symbol: String,
    date_of_purchase :Date,
    date_of_sell :Date,
    status:String
})

module.exports = history;