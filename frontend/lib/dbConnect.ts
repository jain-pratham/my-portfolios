import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/corewatch";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log(`🔌 [MongoDB] Next.js attempting database connection to: ${MONGODB_URI}`);
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("🔋 [MongoDB] Connected to database via Mongoose");
        return mongooseInstance;
      })
      .catch(async (err) => {
        console.warn(`⚠️ [MongoDB] Connection to Atlas failed: ${err.message}. Falling back to local/in-memory database on 27017...`);
        const fallbackUri = "mongodb://127.0.0.1:27017/corewatch";
        return mongoose.connect(fallbackUri, opts);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ [MongoDB] Database connection failed:", e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
