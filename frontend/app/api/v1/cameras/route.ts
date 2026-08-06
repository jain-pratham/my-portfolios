import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { Camera } from "@/models/index";

// Helper to generate camera key (CAM- + 6 random uppercase alphanumeric characters)
function generateCameraKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CAM-${result}`;
}

// Helper to generate 32-character hex secret token
function generateSecretToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

// ============================================================================
// POST: Register a new camera and provision keys/tokens under a ShopId
// ============================================================================
export async function POST(request: Request) {
  try {
    // 1. Establish database connection (port 27017 fallback support)
    await dbConnect();

    // 2. Parse JSON body
    const body = await request.json().catch(() => ({}));
    const { shopId, name, streamUrl, streamType } = body;

    if (!shopId || !name) {
      return NextResponse.json(
        { success: false, error: "Bad Request: shopId and name are required fields" },
        { status: 400 }
      );
    }

    // 3. Generate unique identifiers
    const cameraKey = generateCameraKey();
    const secretToken = generateSecretToken();

    // 4. Save Camera configuration to MongoDB
    const newCamera = await Camera.create({
      shopId,
      name,
      cameraKey,
      secretToken,
      streamUrl: streamUrl || "",
      streamType: streamType || "IP_WEBCAM",
      status: "ONLINE",
    });

    console.log(`🎥 [V1 Cameras] Registered new camera key: ${cameraKey} under shopId: ${shopId}`);

    return NextResponse.json(
      {
        success: true,
        camera: {
          cameraKey: newCamera.cameraKey,
          secretToken: newCamera.secretToken,
          name: newCamera.name,
          streamUrl: newCamera.streamUrl,
          streamType: newCamera.streamType,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ [V1 Cameras] POST creation failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET: List all cameras registered under a specific ShopId
// ============================================================================
export async function GET(request: Request) {
  try {
    // 1. Establish database connection
    await dbConnect();

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shopId");

    if (!shopId) {
      return NextResponse.json(
        { success: false, error: "Bad Request: shopId query parameter is required" },
        { status: 400 }
      );
    }

    // 3. Query all camera devices from MongoDB
    const cameras = await Camera.find({ shopId });

    return NextResponse.json(
      {
        success: true,
        count: cameras.length,
        data: cameras,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [V1 Cameras] GET queries failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
