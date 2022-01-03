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
    isSelled:Boolean,
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        Ref:'Users'
    }
})
const Assets = mongoose.model("Assets", assetsSchema);
module.exports = Assets;