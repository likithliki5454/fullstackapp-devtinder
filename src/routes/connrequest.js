const express = require('express');
const connrequestRouter = express.Router();
const userAuth = require('../Middleware/authLogic');

connrequestRouter.post('/connectionreq',userAuth, async (req,res)=>{
    console.log(req.user);
    const user=req.user.emailId;
    res.send('Connection request sent by '+user);
})

module.exports =connrequestRouter;