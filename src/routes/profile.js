const express = require('express');
const profilerouter = express.Router();
const userAuth = require('../Middleware/authLogic');

profilerouter.get('/profile/view', userAuth ,async (req, res) => {  
    try{
        if(req.user){
            res.send(req.user);
        }else{
            res.status(404).send('User not found');
        }
    }catch(err){
        res.status(400).send('Error fetching profile'+err.message);
    }
})

module.exports =profilerouter;

