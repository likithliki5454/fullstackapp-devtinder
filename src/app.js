const express=require('express');
const app=express();


app.use('/node',(req,res)=>{
res.send('hello there')
})
app.listen(3000, ()=>{
    console.log('sucess')
})