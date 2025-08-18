// const app=require('express');

const authadmin=('/admin',(req,res,next)=>{
    const token='abc';
    const isvalidtocken=token==='abc';
    if(isvalidtocken){
        next();
    }
    else{
        res.status(401).send('invalid token');
    }
})

const authuser=('/user',(req,res,next)=>{
    const token='abcd';
    const isvalidtocken=token==='abcd';
    if(isvalidtocken){
        next();
    }
    else{
        res.status(401).send('invalid token');
    }
})

module.exports = { authadmin, authuser };