const express = require('express');
const profilerouter = express.Router();
const userAuth = require('../Middleware/authLogic');

profilerouter.get('/profile', userAuth ,async (req, res) => {  
    try {
        const user=req.user
        if(!user)   {
            return res.status(404).send('User not found');
        }
        res.send('Profile data accessed');
    }
    catch (err) {
        res.status(500).send('Error accessing profile data');
    }})

module.exports =profilerouter;

