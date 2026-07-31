import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Request } from "express";
import User from "../models/User";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "super_secret_corewatch_key_2026"
      );

      // Get user from the token, excluding password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401).json({ success: false, message: "Not authorized, user not found" });
        return;
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({
        success: false,
        message: `Not authorized, token failed: ${error instanceof Error ? error.message : String(error)}`
      });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "Not authorized, no token" });
    return;
  }
};

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied, admin role required" });
  }
};
