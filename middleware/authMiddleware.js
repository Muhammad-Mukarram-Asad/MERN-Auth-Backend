import jwt from "jsonwebtoken";
import User from "../models/userModels.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt_token;

    if (token) {
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        }
        catch(error)
        {
            res.status(401);
            throw new Error("Not authorized, In-valid token");
        }
        }

    else{
        res.status(401);
        throw new Error("Not authorized, No token");
    }
});

export default protect;
    