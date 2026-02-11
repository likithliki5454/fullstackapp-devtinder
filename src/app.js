const express = require('express');
const app = express();
const connectDB = require('./Config/database.js');
const cookieParser = require('cookie-parser')



const authRouter = require('./routes/auth.js');
const profilerouter = require('./routes/profile.js');
const connrequestRouter = require('./routes/request.js');
const userRouter = require('./routes/UserRoute.js');
const cors=require('cors')
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/', authRouter);
app.use('/', profilerouter);
app.use('/', connrequestRouter);
app.use('/', userRouter)



// Connect to DB and start server
connectDB().then(() => {
    console.log('Connected to database');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error('Error connecting to database:', err);
});
