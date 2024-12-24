const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Credentials is required' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Credentials is required' });
        }
        try {
            jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Token expired' });
            } else {
                console.error(err);
                return res.status(401).json({ success: false, message: 'Invalid token' });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
