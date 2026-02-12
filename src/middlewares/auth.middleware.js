const { adminToken } = require("../config/env");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        if (token !== adminToken) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = authMiddleware;
