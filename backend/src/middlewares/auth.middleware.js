import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import TokenBlacklist from "../models/blacklist.model.js";

/**
 * @name isAuth
 * @description Middleware to check if the user is authenticated by verifying the JWT token
 * @access private
 */
export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Check if the token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Exclude password from user object
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
}