const validator=require('validator');


const validatesignupdata=(req)=>{
    const { firstName, lastName, emailId, password } = req.body;
    if(!firstName || !lastName ){
        throw new Error('invalid name ');
    }else if(!validator.isEmail(emailId)){
        throw new Error('invalid email');
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('password is not strong enough');
    }   
}

module.exports={validatesignupdata};