const jwt = require('jsonwebtoken')
require('dotenv').config()

const generateToken = (user) => {
    return jwt.sign({ userId: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "2h" })
}

module.exports = generateToken