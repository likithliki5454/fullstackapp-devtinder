const express = require('express');
const app = express();
const User = require('./models/user.js');   // Use only this
const connectDB = require('./Config/database.js');
const user = require('./models/user.js');
const { validatesignupdata } = require('./utils/validations');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON bodies
const userAuth = require('./Middleware/auth');

// POST route - create user
app.post('/signup', async (req, res) => {
    validatesignupdata(req);//written in validations.js page 
    const { firstName, lastName, emailId, password } = req.body;
    const hasshedpwd = await signPWD(password)
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: hasshedpwd
    });

    try {
        await user.save();
        res.cookie('token', 'hjgligflglifiougfeirofgiefgeg')
        res.send('User signed up successfully');
    } catch (error) {
        res.status(400).send("ERROR" + error.message);
        // console.error("Read error:", error);
    }
});

app.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            res.status(404).send('Invalid email or password');
        }
        console.log('user found:', user);
        const ispwvalid = await user.toPWD(password);
        if (ispwvalid) {
            const token = await user.getJwt();
            console.log("Generated JWT token:", token);
            res.cookie('token', token,expire=new Date(Date.now()+3600000), httpOnly=true);
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

app.get('/profile', userAuth ,async (req, res) => {  
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


app.post('/connectionreq',userAuth, async (req,res)=>{
    console.log(req.user);
    const user=req.user.emailId;
    res.send('Connection request sent by '+user);
})

app.get('/user', async (req, res) => {
    const resd = req.body.lastName
    try {
        const ud = await User.find({ lastName: resd })
        if (ud.length === 0) {
            res.status(404).send('User not found');
        } else {
            console.log("Retrieved user data:", ud);
            res.send(ud)
        }
    }
    catch (err) {
        console.error("Read error:", err);
        res.status(500).send('Error reading user data');
    }
})

app.patch('/user/:id', async (req, res) => {
    const updateuser = req.params?.id;
    const data = req.body;
    console.log("Update data received:", data);
    try {
        const allowed = ['lastName', 'skills']
        const alloweddata = Object.keys(data).every((k) => {
            return allowed.includes(k);
        })
        console.log("data lengths?", data.skills.length);
        if (data?.skills.length > 9) {
            throw new Error('too many updates')
        }
        if (!alloweddata) {
            throw new Error('invalid updates')
        }
        const du = await User.findByIdAndUpdate({ _id: updateuser }, data, { returnDocument: 'after', runvalidators: true });
        if (!du) {
            res.status(404).send('User not found for update');
        }
        else {
            console.log("update user data:", du);
            res.send('data updated successfully');
        }
    } catch (error) {
        console.error("update error:", error.message);
        res.status(500).send(error.message);
    }
})

app.delete('/user', async (req, res) => {
    const deluser = req.body.id
    try {
        const du = await User.findByIdAndDelete(deluser)
        if (!du) {
            res.status(404).send('User not found for deletion');
        } else {
            console.log("Deleted user data:", du);
            res.send('User deleted successfully')
        }
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).send('Error deleting user data');
    }
})



// Connect to DB and start server
connectDB().then(() => {
    console.log('Connected to database');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error('Error connecting to database:', err);
});
