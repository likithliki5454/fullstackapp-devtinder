const express = require('express');
const user = require('../models/user');
const userAuth = require('../Middleware/authLogic');
const connectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

userRouter.get('/user/requests/ignored', userAuth, async (req, res) => {
    try {
        //logic to check all the pending connection requests for the logged-in user       
        const loggedInUserId = req.user._id;
        const pendingRequests = await connectionRequest.find({ toUserId: loggedInUserId, status: 'ignore' }).populate('fromUserId', 'firstName');
        res.status(200).json({ pendingRequests, message: 'Fetched pending requests successfully' });
    }
    catch (error) {
        console.error("Error fetching requests:", error.message);
        res.status(500).send('Error fetching requests');
    }
});

userRouter.get('/user/requests/accepted', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const matcheduser=await connectionRequest.find({ 
        $or: [
            { fromUserId: loggedInUserId,status: 'accepted' },
            { toUserId: loggedInUserId, status: 'accepted' }
        ] 
    })
    .populate('fromUserId', 'firstName')
    .populate('toUserId', 'firstName');


    const data=matcheduser.map((connection)=>{
        if(connection.fromUserId._id.equals(loggedInUserId)){
            return connection.toUserId;
        }else{
            return connection.fromUserId;
        }       
    });
        res.status(200).json({ data, message: 'Fetched matched users successfully' });
    }
    catch (error) {
        console.error("Error fetching requests:", error.message);
        res.status(500).send('Error fetching requests');
    }
})


module.exports = userRouter;

