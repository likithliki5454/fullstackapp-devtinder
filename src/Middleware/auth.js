// const app=require('express');

const authadmin=((err,req,res,next)=>{
    if(err){
    res.status(500).send('server error');
}
    const token='abc';
    const isvalidtocken=token==='abc';
    if(isvalidtocken){
        next();
    }
    else{
        res.status(401).send('invalid token');
    }
})

const authuser=((err,req,res,next)=>{
if(err){
    res.status(500).send('server error');
}
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