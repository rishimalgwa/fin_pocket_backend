const express = require('express')
const Assets = require('../models/assets')
const router = express.Router();
var request = require('request');
const assets = require('../models/assets');

const API_KEY =process.env.API_KEY;

router.post('/addAsset',async(req,res)=>
{
  var url ='';

  if(req.body.assetType === 'stock'){
  
  url  = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+req.body.symbol+'.BSE&apikey='+API_KEY;
  }else if(req.body.assetType === 'crypto'){
    url = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency='+req.body.symbol+'&to_currency=INR&apikey='+API_KEY;
  }else{
    res.status(404).send({error:"asset type not supported"})
  }

   
  
   request.get({
       url: url,
       json: true,
       headers: {'User-Agent': 'request'}
     },async (err, resp, data) => {
       if (err) {
        res.status(500)
         console.log('Error:', err);
       } else if (res.statusCode !== 200) {
         res.status(404)
         console.log('Status:', res.statusCode);
         
       } else {
         // data is successfully parsed as a JSON object:
        // console.log(data);
      var  currentPrice =0;
      if(req.body.assetType === 'stock'){
currentPrice  = parseInt(data['Global Quote']['05. price']);
      }else{
        currentPrice  = parseInt(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
      }
     
        var asset = Assets({...req.body,"lastCheckedPrice":currentPrice}); 
        try {
          await asset.save()
          res.status(200).send(asset)
        } catch (e) {
            res.status(500).send('ERROR')
        }
       }
   });
    
})
module.exports = router;