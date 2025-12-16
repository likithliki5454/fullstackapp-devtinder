const express = require('express');
const connrequestRouter = express.Router();
const userAuth = require('../Middleware/authLogic');
const connectionRequest = require('../models/connectionRequest.js');
const user = require('../models/user.js');


connrequestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params?.toUserId;
        const status = req.params?.status;

        const touserispresentindb = await user.findById(toUserId);
        if (!touserispresentindb) {
            return res.status(404).json({ message: 'user is not present in database' });
        }
        const allowdeStatus = ['pending', 'intrested', 'rejected'];
        if (!allowdeStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const connectionrequest = await connectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (connectionrequest) {
            return res.status(400).json({ message: 'You have already sent a request to this user' });
        }
        const newRequest = new connectionRequest({
            fromUserId,
            toUserId,
            status
        });

        await newRequest.save();
        res.status(201).json({ message: req.user.firstName + ' is ' + status +" "+ touserispresentindb.firstName, request: newRequest });

    } catch (error) {
        console.error("Connection request error:", error.message);
        res.status(500).send(error.message);
    }
})
module.exports = connrequestRouter