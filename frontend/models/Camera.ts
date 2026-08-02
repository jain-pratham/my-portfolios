import mongoose, { Schema } from "mongoose";

const CameraSchema = new Schema(
  {
    cameraKey: {
      type: String,
      required: [true, "Camera Key is required"],
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"],
    },
    locationName: {
      type: String,
      required: [true, "Location name is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Camera || mongoose.model("Camera", CameraSchema);
