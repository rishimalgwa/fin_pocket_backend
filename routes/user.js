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
        res.status(400).send('ERROR')
    }
})
router.post('/login',async(req,res)=>
{
    try {
        var user =await User.findByCredintials(req.body.email,req.body.password); 
       
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send({msg:'error'})
    }
})
module.exports = router;