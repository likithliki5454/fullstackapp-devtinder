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
        const matcheduser = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId, status: 'accepted' },
                { toUserId: loggedInUserId, status: 'accepted' }
            ]
        })
            .populate('fromUserId', 'firstName')
            .populate('toUserId', 'firstName');


        const data = matcheduser.map((connection) => {
            if (connection.fromUserId._id.equals(loggedInUserId)) {
                return connection.toUserId;
            } else {
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


userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const count = parseInt(req.query.count) || 10;
        const skip = (page - 1) * count;
        
        const connectionrequests = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        }).select('fromUserId toUserId status');

        const hideUserIds = new Set();

        connectionrequests.forEach((request) => {
            hideUserIds.add(request.fromUserId.toString());
            hideUserIds.add(request.toUserId.toString());
        });

const feedUsers = await user.find({
    $and: [
        { _id: { $ne: loggedInUserId } },
        { _id: { $nin: Array.from(hideUserIds) } }
    ]
})
.select('-password')   // ⬅️ exclude password only
.skip(skip)
.limit(count);

        res.json({
            message: 'Feed users fetched successfully',
            users: feedUsers
        });

    } catch (error) {
        console.error("Error fetching feed:", error.message);
        res.status(500).json({ message: 'Error fetching feed' });
    }
});

module.exports = userRouter;
