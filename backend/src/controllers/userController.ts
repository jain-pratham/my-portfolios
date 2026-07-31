import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import User from "../models/User";

// @desc    Get all users (excluding passwords)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error fetching users",
    });
  }
};

// @desc    Create a user (Admin bypass)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error creating user",
    });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server error deleting user",
    });
  }
};
