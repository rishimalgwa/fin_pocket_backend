const mongoose = require("mongoose");

const assetsSchema = mongoose.Schema({
    assetType:String,
    buyPrice:Number,
    quantity:Number,
    name:String,
    dateOfPurchase :Date,
    dateOfSell :Date,
    symbol: String,
    lastCheckedPrice:Number,
    isSelled:Boolean
})
const Assets = mongoose.model("Assets", assetsSchema);
module.exports = Assets;