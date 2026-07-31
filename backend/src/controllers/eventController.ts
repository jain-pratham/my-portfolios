import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import Event from "../models/Event";
import User from "../models/User";
import { emitToUser } from "../config/socket";

// Helper to sanitize base64 strings and save as JPEG
const saveBase64Image = (base64String: string, outputDir: string): string => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Strip metadata prefix if exists (e.g. "data:image/jpeg;base64,")
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  let base64Data = base64String;
  
  if (matches && matches.length === 3) {
    base64Data = matches[2];
  }

  const buffer = Buffer.from(base64Data, "base64");
  
  // Create unique filename
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const uniqueId = crypto.randomBytes(4).toString("hex");
  const filename = `event_${timestamp}_${uniqueId}.jpg`;
  
  const fullPath = path.join(outputDir, filename);
  fs.writeFileSync(fullPath, buffer);

  return filename;
};

/**
 * Handles incoming POST events from the AI Service.
 * Saves base64 snapshots to filesystem and stores metadata in MongoDB.
 * Dispatches real-time Socket.IO events to authorized clients.
 */
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const { cameraId, customerId, eventType, confidence, personCount, snapshot } = req.body;

  try {
    // 1. Validation
    if (!cameraId || !customerId || !confidence || !snapshot) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    // 2. Validate Customer Exists
    const customer = await User.findById(customerId);
    if (!customer) {
      res.status(404).json({ success: false, message: "Associated customer not found" });
      return;
    }

    // 3. Save snapshot to static directory
    const uploadDir = path.join(process.cwd(), "uploads/snapshots");
    const filename = saveBase64Image(snapshot, uploadDir);
    const snapshotPath = `/uploads/snapshots/${filename}`;

    // 4. Create and save event in DB
    const event = await Event.create({
      cameraId,
      customerId,
      eventType: eventType || "person_detected",
      confidence,
      personCount: personCount || 1,
      snapshotPath,
    });

    // 5. Emit live Socket.IO notification to correct customer
    emitToUser(customerId.toString(), "new-security-event", {
      eventId: event._id,
      cameraId: event.cameraId,
      customerId: event.customerId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      confidence: event.confidence,
      personCount: event.personCount,
      snapshotPath: event.snapshotPath,
      status: event.status,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create event" });
  }
};

/**
 * Retrieves all events for the logged-in customer.
 */
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user._id is populated by JWT auth middleware (protect)
    const events = await Event.find({ customerId: req.user._id }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error: any) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve events" });
  }
};

/**
 * Marks a specific event as read.
 */
export const markRead = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    // Security check: ensure event belongs to logged-in user
    if (event.customerId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: "Unauthorized access to this event" });
      return;
    }

    event.status = "read";
    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    console.error("Error marking event as read:", error);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
};

/**
 * Marks all unread events for the logged-in customer as read.
 */
export const markAllRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await Event.updateMany(
      { customerId: req.user._id, status: "unread" },
      { status: "read" }
    );

    res.status(200).json({
      success: true,
      message: "All events marked as read",
    });
  } catch (error: any) {
    console.error("Error marking all events as read:", error);
    res.status(500).json({ success: false, message: "Failed to update events" });
  }
};
