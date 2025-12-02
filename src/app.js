const express = require('express');
const app = express();
const User = require('./models/user.js');   // Use only this

const connectDB = require('./Config/database.js');
const user = require('./models/user.js');
app.use(express.json()); // Middleware to parse JSON bodies

// POST route - create user
app.post('/signup', async (req, res) => {
    console.log("Received body:", req.body);
    const data = new User(req.body);
    try {
        const savedUser = await data.save();
        console.log("Saved user:", savedUser);
        res.send('User signed up successfully');
    } catch (error) {
        console.error("Save error:", error);
        res.status(500).send('Error signing up user');
    }
});

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



app.delete('/user', async (req, res) => {
    const deluser=req.body.id
    try {
        const du=await User.findByIdAndDelete(deluser)
        if(!du){
            res.status(404).send('User not found for deletion');
        }else{
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
