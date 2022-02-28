const express = require('express')
const User = require('../models/user')
const router = express.Router();
const auth = require('../middleware/auth')

router.post('/signup',async(req,res)=>
{
    var user = User(req.body); 
    try {
      await user.save()
        var token = await user.generateAuthToken();
       
        res.status(200).send({user,token})
    } catch (e) {
        res.status(400).send('ERROR')
    }
})



router.post('/login',async(req,res)=>
{
    try {
        var user =await User.findByCredintials(req.body.email,req.body.password); 
        var token = await user.generateAuthToken();
       
        res.status(200).send({user,token})
    } catch (e) {
        res.status(400).send({msg:'error',e})
    }
})
router.post('/logout',auth,async(req,res)=>
{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send({msg:'error in loggin out'})
    }
})

router.get('/profile',auth,async(req,res)=>
{
    res.send(req.user)
})


module.exports = router;