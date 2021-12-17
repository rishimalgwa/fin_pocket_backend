const express = require('express')
const User = require('../models/user')
const router = express.Router();


router.post('/signup',async(req,res)=>
{
    var user = User(req.body); 
    try {
        user.save()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send('ERROR')
    }
})
module.exports = router;