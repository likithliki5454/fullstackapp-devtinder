const express = require('express');
const { validatesignupdata } = require('../utils/validations');
const User = require('../models/user.js');

const authRouter = express.Router();

// POST route - create user
authRouter.post('/signup', async (req, res) => {
    try {
        validatesignupdata(req);//written in validations.js page 
        const { firstName, lastName, emailId, password } = req.body;
        const hasshedpwd = await signPWD(password)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hasshedpwd
        });
        await user.save();
        res.send('User signed up successfully');
    } catch (error) {
        res.status(400).send("ERROR" + error.message);
        // console.error("Read error:", error);
    }
});


authRouter.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            res.status(404).send('Invalid email or password');
        }
        const ispwvalid = await user.toPWD(password);
        if (ispwvalid) {
            const token = await user.getJwt();
            res.cookie('token', token, expire = new Date(Date.now() + 3600000), httpOnly = true);
            res.send('Login successful');
        }
        else {
            res.status(404).send('Invalid email or password');
        }
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).send('Error during login');
    }
}); //likith added 


authRouter.post('/logout', (req, res) => {
    res.cookie('token', null, { expire: new Date(Date.now()) }, httpOnly = true);
    res.send('Logout successful');
})

module.exports = authRouter