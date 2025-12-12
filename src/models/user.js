const mangoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const userschema = mangoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        unique: true,
        lowsercase: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is invalid');
            }
        }
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
        default: 18,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error('gender must be male,female or other');
            }
        }
    },
    skills: {
        type: [String],
    }
}, { timestamps: true })

userschema.methods.getJwt = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, '1057@Liki', { expiresIn: '1h' })
    return token;
}

userschema.methods.toPWD = async function (plainpwd) {
    const user = this;
    const hasshedpwd = bcrypt.compare(plainpwd, user.password)
    return hasshedpwd;
}

signPWD = async function (pwd) {
    const encryptedpwd = await bcrypt.hash(pwd, 10);
    return encryptedpwd;
}

module.exports = mangoose.model('User', userschema);
