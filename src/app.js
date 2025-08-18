const express=require('express');
const app=express();



// app.get('/node/:id',(req,res)=>{
// res.send('selected id '+ req.params.id)
// });  routing  example http://localhost:3000/node/78


app.listen(3000, ()=>{
    console.log('sucess')
})