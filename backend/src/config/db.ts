import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/User";

let mongod: MongoMemoryServer | null = null;

const seedAdmin = async (): Promise<void> => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME || "Super";
  const lastName = process.env.ADMIN_LAST_NAME || "Admin";

  if (!email || !password) {
    console.log("Admin email or password not specified in environment variables. Seeding skipped.");
    return;
  }

  try {
    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log(`Admin user with email ${email} already exists in database.`);
      return;
    }

    const name = `${firstName} ${lastName}`.trim();
    await User.create({
      name,
      email,
      password, // hashed automatically by UserSchema pre-save hook
      role: "admin",
    });

    console.log(`Admin user (${email}) created successfully from env variables.`);
  } catch (error) {
    console.error("Error seeding admin user:", error);
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
    await seedAdmin();
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
      await seedAdmin();
    } catch (err) {
      console.error(`In-Memory MongoDB failed to start: ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  }
};

