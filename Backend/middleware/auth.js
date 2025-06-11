const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access denied. No token provided.",
        });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken; // attach user info to request
        next();
    } catch (err) {
        const isExpired = err.name === "TokenExpiredError";
        return res.status(403).json({
            message: isExpired ? "Token expired" : "Invalid token",
            error: true,
            success: false,
        });
    }
};

module.exports = authenticateToken;
