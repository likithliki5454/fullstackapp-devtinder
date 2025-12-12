const jwt  = require("jsonwebtoken");
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if(!token){
            throw new Error('No token found');
        }
        const decodedData = jwt.verify(token, '1057@Liki')
        const { _id } = decodedData;
        const user =await User.findById(_id);
        console.log('user'+ user);
        
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user;
        next()
    } catch (error) {
        res.status(401).send('Unauthorized: ' + error.message);
    }
}

module.exports = userAuth;