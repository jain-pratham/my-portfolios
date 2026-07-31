import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { connectDB } from "./config/db";
import { protect, isAdmin } from "./middleware/authMiddleware";
import { initSocket } from "./config/socket";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Import controllers
import { registerUser, loginUser, getMe } from "./controllers/authController";
import { getUsers, createUser, deleteUser } from "./controllers/userController";
import { getLeads, createLead, updateLead, deleteLead } from "./controllers/leadController";

// Public Auth Routes
app.post("/api/auth/register", registerUser);
app.post("/api/auth/login", loginUser);
app.get("/api/auth/me", protect, getMe);

// Admin-only User Routes
app.get("/api/users", protect, isAdmin, getUsers);
app.post("/api/users", protect, isAdmin, createUser);
app.delete("/api/users/:id", protect, isAdmin, deleteUser);

// CRM Lead Routes
app.get("/api/leads", protect, getLeads);
app.post("/api/leads", protect, createLead);
app.put("/api/leads/:id", protect, updateLead);
app.delete("/api/leads/:id", protect, isAdmin, deleteLead);

// Import event controllers
import { createEvent, getEvents, markRead, markAllRead } from "./controllers/eventController";

// CCTV Alert Routes
app.post("/api/events", createEvent);
app.get("/api/events", protect, getEvents);
app.put("/api/events/read-all", protect, markAllRead);
app.put("/api/events/:id/read", protect, markRead);

// Serve Static Uploads (for CCTV snapshots)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Basic health check route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "CoreWatch CRM Backend API is running..." });
});

// Seed Initial CRM Data (Helper API)
// If database is completely empty, it sets up one admin, one user, and some dummy leads
app.post("/api/seed", async (req: Request, res: Response) => {
  try {
    const User = require("./models/User").default;
    const Lead = require("./models/Lead").default;

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      res.status(400).json({ success: false, message: "Database already has users. Seeding skipped." });
      return;
    }

    // Create Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@corewatch.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";
    const adminFirstName = process.env.ADMIN_FIRST_NAME || "System";
    const adminLastName = process.env.ADMIN_LAST_NAME || "Admin";

    const admin = await User.create({
      name: `${adminFirstName} ${adminLastName}`.trim(),
      email: adminEmail,
      password: adminPassword, // Will be hashed via pre-save hook
      role: "admin",
    });

    // Create User
    const user = await User.create({
      name: "John Agent",
      email: "agent@corewatch.com",
      password: "password123", // Will be hashed via pre-save hook
      role: "user",
    });

    // Create Leads
    const leads = [
      {
        name: "Alice Smith",
        company: "Smith retail shop",
        email: "alice@smithretail.com",
        phone: "+15550199",
        status: "new",
        assignedTo: admin._id,
        notes: "Interested in AI camera alerts for security.",
      },
      {
        name: "Bob Jones",
        company: "Jones Warehouse LLC",
        email: "bob@joneswh.com",
        phone: "+15550288",
        status: "contacted",
        assignedTo: user._id,
        notes: "Wants pricing structure for 10 cameras.",
      },
      {
        name: "Charlie Brown",
        company: "Downtown Office Plaza",
        email: "charlie@brownproperties.com",
        phone: "+15550377",
        status: "proposal",
        assignedTo: user._id,
        notes: "Sent proposal. Awaiting confirmation.",
      },
      {
        name: "David Lee",
        company: "Lee Electronics Store",
        email: "david@leeelectronics.com",
        phone: "+15550466",
        status: "won",
        assignedTo: admin._id,
        notes: "Deal closed. Installation scheduled for next Monday.",
      },
    ];

    await Lead.insertMany(leads);

    res.status(201).json({
      success: true,
      message: "Seeding complete!",
      accounts: {
        admin: { email: adminEmail, password: adminPassword },
        user: { email: "agent@corewatch.com", password: "password123" },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Seeding failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
