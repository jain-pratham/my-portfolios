import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Camera, Alert } from "@/models/index";

// ============================================================================
// POST: Receive security alerts from Python Edge AI engine
// ============================================================================
export async function POST(request: Request) {
  try {
    // 1. Establish database connection (with local port 27017 fallback support)
    await dbConnect();

    // 2. Read authentication headers from the edge device
    const cameraKey = request.headers.get("x-camera-key");
    const secretToken = request.headers.get("x-camera-token");

    if (!cameraKey || !secretToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing authentication headers (x-camera-key, x-camera-token)",
        },
        { status: 400 }
      );
    }

    // 3. Validate camera credentials in MongoDB
    const camera = await Camera.findOne({ cameraKey, secretToken });
    if (!camera) {
      console.warn(`🚨 [V1 Alerts] Unauthorized threat alert attempt with key: ${cameraKey}`);
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid camera key or token" },
        { status: 401 }
      );
    }

    // 4. Parse and validate JSON request body
    const body = await request.json().catch(() => ({}));
    const { imageUrl, threatLevel, threatType, timestamp } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "Bad Request: imageUrl is required" },
        { status: 400 }
      );
    }

    // 5. Create new alert record linked to the camera's owner shopId
    const newAlert = await Alert.create({
      cameraKey,
      shopId: camera.shopId,
      threatLevel: threatLevel || "HIGH",
      threatType: threatType || "HUMAN_INTRUSION",
      imageUrl,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      isResolved: false,
    });

    console.log(`🚨 [V1 Alerts] Saved threat level [${newAlert.threatLevel}] alert for camera: ${cameraKey}`);

    return NextResponse.json(
      {
        success: true,
        message: "Threat alert registered successfully",
        data: newAlert,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ [V1 Alerts] POST processing failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET: Retrieve sorted historical alerts with dynamic limit filters
// ============================================================================
export async function GET(request: Request) {
  try {
    // 1. Establish database connection
    await dbConnect();

    // 2. Parse query filters
    const { searchParams } = new URL(request.url);
    const cameraKey = searchParams.get("cameraKey");
    const limitQuery = searchParams.get("limit");
    const limit = limitQuery ? parseInt(limitQuery, 10) : 20;

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json(
        { success: false, error: "Bad Request: Invalid limit parameter" },
        { status: 400 }
      );
    }

    // Build filter object dynamically
    const filter: any = {};
    if (cameraKey) {
      filter.cameraKey = cameraKey;
    }

    // 3. Query sorted list from MongoDB
    const alerts = await Alert.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        count: alerts.length,
        data: alerts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ [V1 Alerts] GET queries failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
