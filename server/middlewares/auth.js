const User = require("../models/User");
const jwt = require("jsonwebtoken");

require('dotenv').config();

exports.auth = async (req, res, next) => {
    console.log(req.body);
    const token = req?.body?.token || req?.cookies?.token || req.headers['authorization']?.split(' ')[1];
    console.log("token",token ? "Present" : "Not Present");
    if (!token) {
        console.log("No Token Found");
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        console.log("User is Authenticated");
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}