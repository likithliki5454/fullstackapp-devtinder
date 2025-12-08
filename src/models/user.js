const mangoose=require('mongoose');
const validator=require('validator');
 const userschema=mangoose.Schema({
    firstName:{
    type:String,
    required:true
    },
    lastName: {
        type: String,
    },
    emailId:{
        type: String,
        unique:true,
        lowsercase:true,
        required:true,
        trim:true,
        validate(value){    
            if(!validator.isEmail(value)){
                throw new Error('email is invalid');
            }
        }
    },
    password: {
        type: String,
    },
    age:{
        type: Number,
        default: 18,
        min:18,
    },
    gender:{
        type: String,
        required:true,
        validate(value){    
            if(!['male','female','other'].includes(value)){
                throw new Error('gender must be male,female or other');
            }
    }
    },
    skills:{
        type: [String],
    }
 },{ timestamps:true})

 
 module.exports=mangoose.model('User',userschema);
