const express = require('express')
const Assets = require('../models/assets')
const router = express.Router();
var request = require('request');


router.post('/addAsset',async(req,res)=>
{
   // var asset = Assets(req.body); 
   const API_KEY =process.env.API_KEY;
   var url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=HCLTECH.BSE&apikey='+API_KEY;
   request.get({
       url: url,
       json: true,
       headers: {'User-Agent': 'request'}
     }, (err, res, data) => {
       if (err) {
         console.log('Error:', err);
       } else if (res.statusCode !== 200) {
         console.log('Status:', res.statusCode);
       } else {
         // data is successfully parsed as a JSON object:
         console.log(data);
         d= data;
       }
   });
    try {
        var d;
       
       // user.save()
        res.status(200).send(d)
    } catch (e) {
        res.status(500).send('ERROR')
    }
})
module.exports = router;