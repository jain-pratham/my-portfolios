import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User";

let mongod: MongoMemoryServer | null = null;

const seedDefaultUsers = async (): Promise<void> => {
  try {
    // 1. Admin Account
    const adminEmail = process.env.ADMIN_EMAIL || "admin@corewatch.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log(`Default Admin created: ${adminEmail}`);
    }

    // 2. Standard User Account
    const userEmail = "user@corewatch.com";
    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      await User.create({
        name: "Standard Enterprise User",
        email: userEmail,
        password: "Jpdtp5!!",
        role: "user",
      });
      console.log(`Default User created: ${userEmail}`);
    }

    // 3. Demo Account
    const demoEmail = "demo@corewatch.com";
    const demoExists = await User.findOne({ email: demoEmail });
    if (!demoExists) {
      await User.create({
        name: "Demo Account",
        email: demoEmail,
        password: "Jpdtp5!!",
        role: "demo",
      });
      console.log(`Default Demo created: ${demoEmail}`);
    }
  } catch (error) {
    console.error("Error seeding default users:", error);
  }
};

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/corewatch";
    console.log(`Attempting connection to MongoDB: ${connStr}`);
    
    // Try connecting with a short timeout to fail fast and fallback
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000,
      tlsAllowInvalidCertificates: true, // bypass certificate validation for VPN/proxy compatibility
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    await seedDefaultUsers();
  } catch (error) {
    console.warn(`MongoDB Connection failed: ${error instanceof Error ? error.message : error}`);
    console.log("Spinning up In-Memory MongoDB Server fallback...");
    try {
      mongod = await MongoMemoryServer.create({
        binary: {
          version: "5.0.28"
        }
      });
      const uri = mongod.getUri();
      console.log(`In-Memory MongoDB Server running at: ${uri}`);
      await mongoose.connect(uri);
      console.log("MongoDB Connected: (In-Memory Database)");
      await seedDefaultUsers();
    } catch (err) {
      console.error(`In-Memory MongoDB failed to start: ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  }
};

