import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });
    res.cookie("jwt_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development", // For production where https is used
        sameSite: "strict", // For saving attacks on the server
        maxAge: 1000 * 60 * 60 * 24 * 10, // for convert time into seconds
    }) 
}

export default generateToken;