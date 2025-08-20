const mangoose=require('mongoose');
 const userschema=mangoose.Schema({
    firstName:{
    type:'String',
    },
    lastName: {
        type: String,
    },
    emailId:{
        type: String,
    },
    password: {
        type: String,
    },
    age:{
        type: Number,
    },
    gender:{
        type: String,
    }
 })

 
 module.exports=mangoose.model('User',userschema);
