const express = require("express");
const Assets = require("../models/assets");
const router = express.Router();
var request = require("request");
const axios = require("axios");
const auth = require("../middleware/auth");

const API_KEY = process.env.API_KEY;
const API_KEY1 = process.env.API_KEY1;
const API_KEY2 = process.env.API_KEY2;

router.post("/addAsset", auth, async (req, res) => {
  var url = "";

  var asset = Assets({
    ...req.body,
    lastCheckedPrice: 0,
    owner: req.user._id,
  });
  try {
    await asset.save();
    res.status(200).send(asset);
  } catch (e) {
    res.status(500).send({ error: "ERROR" });
  }
});
router.get("/myAssets", auth, async (req, res) => {
  try {
   var isGreaterThanFive =false;
   var isGreaterThanTen =false;
    const assets = await Assets.find({ owner: req.user._id });
    finalAssests = [];
    if(assets.length>5){
      if(assets.length >10){
        // add 3rd api key
        isGreaterThanTen = true;
      }else{
        // add 2ndapi key
        isGreaterThanFive = true;
      }
    }
    var apikey= '';
    for (var i = 0; i < assets.length; i++) {
      var asset = assets[i];
      var url = "";
        if (isGreaterThanTen && i > 10) {
       
        apikey = API_KEY2;
        }else if(isGreaterThanFive && i>5 && i<=10){
         
         apikey = API_KEY1;
        }else{
        
          apikey = API_KEY;
        }
      if (asset.assetType === "stock") {
        url =
          "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
          asset.symbol +
          ".BSE&apikey=" +
          apikey;
       
      } else if (asset.assetType === "crypto") {
        url =
          "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" +
          asset.symbol +
          "&to_currency=INR&apikey=" +
          apikey;
      
      } else {
        console.log(asset);
        res.status(404).send({ error: "asset type not supported" });
      }
      // console.log("before request");
      // console.log(asset.assetType);
      await axios({
        url: url,
        json: true,
        headers: { "User-Agent": "request" },
      })
        .then((response) => {
          var data = response.data;
          //   console.log(response.data);

          var currentPrice = 0;
          if (asset.assetType === "stock") {
           
            currentPrice = parseInt(data["Global Quote"]["05. price"]);
          } else if (asset.assetType === "crypto") {
          
            currentPrice = parseInt(
              data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
            );
          } else {
            console.log("error");
          }
          asset.lastCheckedPrice = currentPrice;
        })
        .catch(function (error) {
          console.log(error);
        });

      finalAssests.push(asset);
    }

    res.send(finalAssests);
  } catch (e) {
    res.status(400).send({ error: "error in fetching assets" });
  }
});

module.exports = router;
