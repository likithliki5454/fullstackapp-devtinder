const express = require('express');
const app = express();



// app.get('/node/:id',(req,res)=>{
// res.send('selected id '+ req.params.id)
// });  routing  example http://localhost:3000/node/78

//basic middleware example
//if we use "USE" then it will take the first match

// app.use('/',(req,res)=>{
//     res.send('slash page');
// });

// app.get('/test',(req,res)=>{
//     res.send('test page');
// });

//basic middleware example end

//handlling the middleware
// const {authadmin,authuser}=require('./Middleware/auth.js');

// app.use('/admin', authadmin);
// app.use('/user', authuser);

// app.get('/user/getdata',(req,res)=>{
//     res.send('user page');
// });//user

// app.get('/admin/getdata',(req,res)=>{
//     res.send('admin page');
// }); //admin

// app.delete('/admin/delete',(req,res)=>{
// res.send('all data deleted');
// })

//middleware code example end

// ----------------------------------//

// 404 handler (wrong URL)
// app.use((req, res) => {
//     res.status(404).send('Error: Route not found');
// });

// Global error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Server error occurred!');
// });



//database connection



// database connection-----------------------------


app.use(express.json());

const User = require('./models/user.js');

app.post('/signup', async (req, res) => {

    const userobj = new User({
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'jhon@gmail.com',
        password: 'password123',
    })
    try {
        await userobj.save();
        res.send('User signed up successfully');

    } catch (error) {
        res.status(500).send('Error signing up user');
    }
});

const connectDB = require('./Config/database.js');

connectDB().then(() => {
    console.log('connected to database');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error('Error connecting to database:', err);
});


// app.listen(3000, ()=>{
//     console.log('sucess')
// })