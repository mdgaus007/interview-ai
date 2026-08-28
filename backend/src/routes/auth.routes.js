import express from "express"
import { isAuth } from "../middlewares/auth.middleware.js";
import { signup, login, logout,getMe} from "../controllers/auth.controller.js";

const authRouter=express.Router();

/**
 * @route POST /api/auth/signup
 * @description Register a new user
 * @access public 
 */
authRouter.post("/signup",signup)

/**
 * @route POST /api/auth/login
 * @description Login an existing user
 * @access public
 */
authRouter.post("/login", login);

/**
 * @route GET /api/auth/logout
 * @description Logout the user and add the token to the blacklist
 * @access public
 */
authRouter.get("/logout", logout);


/**
 * @route GET /api/auth/get-me
 * @description Get the authenticated user's data
 * @access private
 */
authRouter.get("/get-me", isAuth, getMe);

export default authRouter
