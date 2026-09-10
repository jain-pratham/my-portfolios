import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
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

// GET: Retrieve all cameras for the authenticated user
export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const cameras = await Camera.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: cameras });
  } catch (error: any) {
    console.error("GET cameras error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Register a new camera and generate a unique key
export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const userId = getUserIdFromAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const locationName = body.locationName || "Default Shop Location";

    // Generate CAM-XXXXXX key
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const cameraKey = `CAM-${randomSuffix}`;

    const newCamera = await Camera.create({
      cameraKey,
      userId,
      locationName,
    });

    console.log(`🎥 [Camera Registry] Provisioned new camera ${cameraKey} for user ${userId}`);

    return NextResponse.json({ success: true, data: newCamera }, { status: 201 });
  } catch (error: any) {
    console.error("POST camera registration error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
