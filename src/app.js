const express = require('express');
const app = express();
const User = require('./models/user.js');   // Use only this

const connectDB = require('./Config/database.js');
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

// Connect to DB and start server
connectDB().then(() => {
    console.log('Connected to database');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error('Error connecting to database:', err);
});
