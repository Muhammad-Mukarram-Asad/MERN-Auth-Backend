import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";
// @desc     Auth user
//  route POST /api/users/auth
//  access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      message: "User authenticated successfully",
      userData: {
      _id: user.id,
      name: user.name,
      email: user.email,
      }
    });
  } else {
    res.status(400).json({ message: "Invalid email or password" });
    throw new Error("Invalid email or password");
  }
});

// @desc     Register user
//  route POST /api/users/register
//  access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    throw new Error("User already exists");
  }

  try {
  const newUser = await User.create({ name, email, password });

  if (newUser) {
    generateToken(res, newUser._id);

    res.status(201).json({
      message: "User created successfully",
      userData: {
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
    throw new Error("Invalid user data");
  }
}
  catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
    throw new Error("Internal server error");
  }
});

// @desc     logout user
//  route POST /api/users/logout
//  access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt_token", "none", { expires: new Date(0), httpOnly: true });
  res.status(200).json({ message: "User logged out successfully" });
});

// @desc    get user profile
//  route   GET /api/users/profile
//  access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const userData = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    }
  res.status(200).json(userData);
});

// @desc    update user profile
//  route   PUT /api/users/profile
//  access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password) {
            user.password = req.body.password || user.password;    
        }
        const updatedUser = await user.save();
  res.status(200).json({
    message: "User updated successfully",
    userData: {
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    },
  })
}
else {
    res.status(404).json({message: "User not found"})
}
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
