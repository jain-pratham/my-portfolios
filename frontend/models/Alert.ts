import mongoose, { Schema } from "mongoose";

const AlertSchema = new Schema(
  {
    cameraKey: {
      type: String,
      required: [true, "Camera Key is required"],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      default: "Human detected in shop!",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index to optimize listing user alerts by time
AlertSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
