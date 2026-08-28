import { generateToken } from "../utils/generateTokens.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import TokenBlacklist from "../models/blacklist.model.js";
import jwt from "jsonwebtoken";

/**
 * @name  signupController
 * @description Register a new user, expects username, email, and password in the request body
 * @access public
 */
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Process signup logic here
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExistingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (isExistingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    }); // Assuming User is a model for user data
    const token = generateToken(newUser._id, newUser.username); // Assuming _id is the unique identifier for the user

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // Set token in cookie for 1 hour

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

/**
 * @name LoginController
 * @description Login an existing user, expects email and password in the request body
 * @access public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Process login logic here
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Assuming user is authenticated successfully
    const token = generateToken(user._id, user.username); // Assuming _id is the unique identifier for the user
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // Set token in cookie for 1 hour

    res.status(200).json({
      message: "User logged in successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: err.message });
  }
};

/**
 * @name LogoutController
 * @description Logout the user, clears the authentication token
 * @access public
 */
export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.decode(token);

      await TokenBlacklist.create({
        token,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }

    res.clearCookie("token");

    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error logging out user",
      error: err.message,
    });
  }
};


/**
 * @name getMeController
 * @description Get the authenticated user's data
 * @access private
 */
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    res.status(200).json({
      message: "User data retrieved successfully",
      user: req.user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user data", error: err.message });
  }
}