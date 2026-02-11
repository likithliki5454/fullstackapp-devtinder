const express = require('express');
const { validatesignupdata, validateProfile } = require('../utils/validations');
const User = require('../models/user.js');
const userAuth = require('../Middleware/authLogic.js');
const authRouter = express.Router();
const validator = require('validator');
const bcrypt = require('bcrypt');
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
            res.cookie('token', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
            });
            res.send(user);
        }
        else {
            res.status(404).send('Invalid email or password');
        }
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).send('Error during login');
    }
}); //likith added 

authRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        validateProfile(req);
        const loggedinuser = req.user;
        let isUpdated = false;
        Object.keys(req.body).forEach((data) => {
            const newValue = req.body[data];
            const oldValue = loggedinuser[data];
            // For arrays like skills
            if (Array.isArray(newValue)) {
                if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                    loggedinuser[data] = newValue;
                    isUpdated = true;
                }
            }
            // For normal fields
            else if (newValue !== oldValue) {
                loggedinuser[data] = newValue;
                isUpdated = true;
            }
        });
        //  No changes detected
        if (!isUpdated) {
            return res.status(400).json({
                warning: 'No changes detected. Profile already up to date.'
            });
        }
        await loggedinuser.save();
        res.status(200).json({
            message: 'Profile updated successfully',
            user: loggedinuser
        });
    } catch (error) {
        console.log("Profile update error:", error.message);
        res.status(400).send(error.message);
    }
});

authRouter.post('/profile/forgotpassword',async (req,res)=>{
    const newpassword=req.body.password;
    try{
        const editUser=await User.findOne({emailId:req.body.emailId})
        if(!editUser){
            return res.status(404).send('User not found');
        }
        const samepassworrd= await bcrypt.compare(newpassword,editUser.password);
        if(samepassworrd){
            return res.status(400).send('New password must be different from the old password');
        }
        if(!validator.isStrongPassword(newpassword)){
            res.status(400).send('Password is not strong enough');
        }else{
            const hasshedpwd=await signPWD(newpassword);
            editUser.password=hasshedpwd;
            await editUser.save();
            res.send('Password reset successful');
        }
        }catch(err){
            res.send('not able to set password'+err.message);
        }
})

authRouter.patch('/profile/changepassword',userAuth,async (req,res)=>{
const {oldpassword,newpassword}=req.body;
    try{
        const loggedinuser=req.user;
        const ispwvalid= await loggedinuser.toPWD(oldpassword);
        if(!ispwvalid){
            return res.status(400).send('Old password is incorrect');
        }
        if(!validator.isStrongPassword(newpassword)){
            return res.status(400).send('New password is not strong enough');
        }else{
            const hasshedpwd=await signPWD(newpassword);;
            loggedinuser.password=hasshedpwd;
            await loggedinuser.save();
            res.send('Password changed successfully');
        }
    }catch(err){
    res.status(500).send('Error changing password'+err.message);
    }
})

authRouter.post('/logout', (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.send('Logout successful');
})

module.exports = authRouter