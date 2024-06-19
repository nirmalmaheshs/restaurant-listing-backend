const jwt = require('jsonwebtoken');
const CustomError = require("src/models/CustomError");

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        throw new CustomError(403,'UnAuthenticated');
    }
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        next();
    } catch (ex) {
        res.status(400).send({message: 'Invalid token'});
    }
};

module.exports = auth;
