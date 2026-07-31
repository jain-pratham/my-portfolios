import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "super_secret_corewatch_key_2026", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user (including admins)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    // Determine final role - fallback to 'user' if not explicitly provided or invalid
    const finalRole = role === "admin" ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString()),
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error during registration",
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isMatch = await (user as any).matchPassword(password);

    if (isMatch) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString()),
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error during login",
    });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    if (req.user) {
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error retrieving profile",
    });
  }
};
