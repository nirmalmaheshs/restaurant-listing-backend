const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../db/schemas/user');
const {checkIsUserExist, getUserByEmail} = require("../service/user");
const CustomError = require("../models/CustomError");
const router = express.Router();

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Register new user
router.post('/register', async (req, res, next) => {
    try {
        const {firstName, lastName, email, password, foodPreference} = req.body;
        const isUserExist = await checkIsUserExist(email);
        if (isUserExist)
            throw new CustomError(400, 'User already exists');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({firstName, lastName, email, password: hashedPassword, foodPreference});
        await user.save();
        res.status(201).json({'message': 'User registered successfully'});
    } catch (e) {
        next(e);
    }
});

// Login user
router.post('/login', async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await getUserByEmail(email);
        if (!user) throw new CustomError(404, 'User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new CustomError(403, 'User does not match');

        const token = jwt.sign({userId: user._id, username: user.email}, secretKey, {expiresIn: '1h'});
        res.json({token});
    } catch (e) {
        next(e);
    }
});

module.exports = router;
