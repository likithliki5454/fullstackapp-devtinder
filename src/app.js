const express = require('express');
const app = express();
const User = require('./models/user.js');   // Use only this

const connectDB = require('./Config/database.js');
const user = require('./models/user.js');
app.use(express.json()); // Middleware to parse JSON bodies
const { validatesignupdata } = require('./utils/validations');
const bcrypt = require('bcrypt');

// POST route - create user
app.post('/signup', async (req, res) => {
    validatesignupdata(req);//written in validations.js page 
    const { firstName, lastName, emailId, password } = req.body;
    const hasshedpwd = await bcrypt.hash(password, 10);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: hasshedpwd
    });

    try {
        await user.save();
        res.send('User signed up successfully');
    } catch (error) {
        res.status(400).send("ERROR" + error.message);
        // console.error("Read error:", error);
    }
});

app.post('/login', async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId: emailId});
        if (!user) {
            res.status(404).send('Invalid email or password');
        } 
        const ispwvalid=await bcrypt.compare(password, user.password)
        if(!ispwvalid){
            res.status(404).send('Invalid email or password');
        }
        else {
            res.send('Login successful');
        }
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).send('Error during login');
    }
}); //likith added 

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
