const express = require('express');
const connrequestRouter = express.Router();
const userAuth = require('../Middleware/authLogic');
const connectionRequest = require('../models/connectionRequest.js');


connrequestRouter.post('/request/send/:status/:toUserId',userAuth, async (req,res)=>{
try{
    const fromUserId = req.user._id;
    const toUserId=req.params?.toUserId;
    const status=req.params?.status;

    const newRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status
    });

    await newRequest.save();
    res.json({message:'Connection request sent successfully',request:newRequest});
    res.status(201).send('Connection request sent successfully');

}catch(error){
    console.error("Connection request error:", error.message);
    res.status(200).send('Error sending connection request');
}
})
module.exports =connrequestRouter