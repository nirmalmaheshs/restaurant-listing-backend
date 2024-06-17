const User = require('../db/schemas/user');
const CustomError = require("../models/CustomError");

const getUserByEmail = async (email) => {
    const user = await User.findOne({email: email});
    if (!user) {
        throw new CustomError(404, 'User not found');
    }
    return user;
}

const checkIsUserExist = async (email) => {
    const user = await User.findOne({email: email});
    return !!user;
}

module.exports = {
    getUserByEmail,
    checkIsUserExist
}
