import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import Alert from "@/models/Alert";
import Camera from "@/models/Camera";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_corewatch_key_2026";

// Helper to authenticate request and extract userId
function getUserIdFromAuth(request: Request): string | null {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch (err) {
    console.error("Auth helper error:", err);
    return null;
  }
}

// GET: Retrieve all alerts for the authenticated user (poll target)
export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    // Query Alerts database for this user, sorted by newest first
    const alerts = await Alert.find({ userId }).sort({ timestamp: -1 }).limit(100);
    return NextResponse.json({ success: true, count: alerts.length, data: alerts });
  } catch (error: any) {
    console.error("GET alerts query error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Accepts secure alerts from Python camera client using CameraKey validation
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json().catch(() => ({}));
    const { cameraKey, imageUrl, timestamp, message } = body;

    if (!cameraKey) {
      return NextResponse.json({ success: false, error: "cameraKey is required" }, { status: 400 });
    }

    // Validate camera key in Camera database and retrieve associated user ID
    const camera = await Camera.findOne({ cameraKey });
    if (!camera) {
      console.warn(`⚠️ [Alerts API] Rejected alert: Camera Key ${cameraKey} is not registered in DB`);
      return NextResponse.json({ success: false, error: "Invalid Camera Key. Camera is not registered." }, { status: 404 });
    }

    const userId = camera.userId;

    // Create the alert document linked to both camera and user
    const newAlert = await Alert.create({
      cameraKey,
      userId,
      imageUrl: imageUrl || "",
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      message: message || "Human detected in shop!",
      isRead: false,
    });

    console.log(`🚨 [Alerts API] Registered alert from camera ${cameraKey} for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Alert logged successfully!",
      data: newAlert
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST alerts processing error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
