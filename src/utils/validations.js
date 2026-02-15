const validator = require('validator');


const validatesignupdata = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error('invalid name ');
    } else if (!validator.isEmail(emailId)) {
        throw new Error('invalid email');
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error('password is not strong enough');
    }
}

const validateProfile = (req) => {
    const allowedFields = ['firstName', 'age', 'skills', 'photoUrl'];
    const isAllowed = Object.keys(req.body).every((field) =>
        allowedFields.includes(field)
    );
    if (!isAllowed) {
        throw new Error('Invalid field update');
    }
    const { firstName, age, skills, photoUrl } = req.body;
    // 2️⃣ firstName validation
    if (firstName && firstName.length > 10) {
        throw new Error('firstName should not exceed 10 characters');
    }
    // 3️⃣ age validation
    if (age && (age < 10 || age > 80)) {
        throw new Error('age must be between 10 and 80');
    }
    // 4️⃣ skills validation
    if (skills && (!Array.isArray(skills) || skills.length > 10)) {
        throw new Error('skills should be an array with max 10 items');
    }
    if(photoUrl && !validator.isURL(photoUrl)){
        throw new Error('Invalid photo URL');
    }

    return true;

};


module.exports = { validatesignupdata, validateProfile };