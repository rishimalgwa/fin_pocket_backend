const express = require("express");
const Assets = require("../models/assets");
const router = express.Router();
var request = require("request");
const axios = require('axios');
const auth = require("../middleware/auth");

const API_KEY = process.env.API_KEY;

router.post("/addAsset", auth, async (req, res) => {
  var url = "";

  if (req.body.assetType === "stock") {
    url =
      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
      req.body.symbol +
      ".BSE&apikey=" +
      API_KEY;
  } else if (req.body.assetType === "crypto") {
    url =
      "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" +
      req.body.symbol +
      "&to_currency=INR&apikey=" +
      API_KEY;
  } else {
    res.status(404).send({ error: "asset type not supported" });
  }
  request.get(
    {
      url: url,
      json: true,
      headers: { "User-Agent": "request" },
    },
    async (err, resp, data) => {
      if (err) {
        res.status(500);
        console.log("Error:", err);
      } else if (res.statusCode !== 200) {
        res.status(404);
        console.log("Status:", res.statusCode);
      } else {
        // data is successfully parsed as a JSON object:
        // console.log(data);
        var currentPrice = 0;
        if (req.body.assetType === "stock") {
          currentPrice = parseInt(data["Global Quote"]["05. price"]);
        } else {
          currentPrice = parseInt(
            data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
          );
        }

        var asset = Assets({
          ...req.body,
          lastCheckedPrice: currentPrice,
          owner: req.user._id,
        });
        try {
          await asset.save();
          res.status(200).send(asset);
        } catch (e) {
          res.status(500).send({ error: "ERROR" });
        }
      }
    }
  );
});
router.get("/myAssets", auth, async (req, res) => {
  try {
    const assets = await Assets.find({ owner: req.user._id });
    finalAssests = [];
    for (var i=0; i<assets.length; i++){
      var asset = assets[i];
      var url = "";
     
      if (asset.assetType === "stock") {
        url =
           "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
           asset.symbol +
           ".BSE&apikey=" +
           API_KEY;
         console.log(url);
       } else if (asset.assetType === "crypto") {
         url =
           "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" +
           asset.symbol +
           "&to_currency=INR&apikey=" +
           API_KEY;
        console.log(url);
      } else {
        console.log(asset);
        res.status(404).send({ error: "asset type not supported" });
      }
      // console.log("before request");
      // console.log(asset.assetType);
     await axios(
        {
          url: url,
          json: true,
          headers: { "User-Agent": "request" },
        }).then((response)=>{
            var data = response.data;
     //   console.log(response.data);
      
        
            var currentPrice = 0;
            if (asset.assetType === "stock") {
              console.log("after request");
              console.log(asset.assetType);
              console.log(data["Global Quote"]["05. price"]);
              currentPrice = parseInt(data["Global Quote"]["05. price"]);
            } else if (asset.assetType === "crypto") {
              console.log("after request");
              console.log(asset.assetType);
              console.log(
                data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
              );
              currentPrice = parseInt(
                data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
              );
            } else {
              console.log("error");
            }
            asset.lastCheckedPrice = currentPrice;
      
    }).catch(function (error) {
      console.log(error);
    })
 
       finalAssests.push(asset);

    }
   // await asyncForEach(assets, async (asset, index,assetsArray) => {
      // var url = "";
     
      // if (asset.assetType === "stock") {
      //   url =
      //      "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
      //      asset.symbol +
      //      ".BSE&apikey=" +
      //      API_KEY;
      //    console.log(url);
      //  } else if (asset.assetType === "crypto") {
      //    url =
      //      "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" +
      //      asset.symbol +
      //      "&to_currency=INR&apikey=" +
      //      API_KEY;
      //   console.log(url);
      // } else {
      //   console.log(asset);
      //   res.status(404).send({ error: "asset type not supported" });
      // }
      // // console.log("before request");
      // // console.log(asset.assetType);
      // request(
      //   {
      //     url: url,
      //     json: true,
      //     headers: { "User-Agent": "request" },
      //   },
      //   async (error, response, data) =>{
      //     if (error) {
      //       res.status(400).send({ error });
      //     } else {
      //       var currentPrice = 0;
      //       if (asset.assetType === "stock") {
      //         console.log("after request");
      //         console.log(asset.assetType);
      //         console.log(data["Global Quote"]["05. price"]);
      //         currentPrice = parseInt(data["Global Quote"]["05. price"]);
      //       } else if (asset.assetType === "crypto") {
      //         console.log("after request");
      //         console.log(asset.assetType);
      //         console.log(
      //           data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
      //         );
      //         currentPrice = parseInt(
      //           data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
      //         );
      //       } else {
      //         console.log("error");
      //       }
      //       asset.lastCheckedPrice = currentPrice;
      //     }
      //   }
      // );
      //  finalAssests.push(asset);
  //  });
      res.send(finalAssests);
  } catch (e) {
    res.status(400).send({ error: "error in fetching assets" });
  }
});

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
module.exports = router;
