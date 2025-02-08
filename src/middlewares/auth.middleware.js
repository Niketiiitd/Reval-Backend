import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const verifyUserJWT = asyncHandler(async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies); // Log the cookies
        

        req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ", "");
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("Token:", token); // Log the token
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const isAuthorized = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", isAuthorized); // Log the decoded token

        const user = await User.findById(isAuthorized._id).select("-password -refreshToken");
        console.log("User:", user); // Log the user

        if (!user) {
            throw new ApiError(401, "Unauthorized request");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error:", error.message); // Log the error
        throw new ApiError(401, error?.message || "Unauthorized request");
    }
});

export default verifyUserJWT;