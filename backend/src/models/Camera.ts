import mongoose, { Schema, Document } from "mongoose";

export interface ICamera extends Document {
  cameraKey: string;
  userId?: mongoose.Types.ObjectId;
  shopId?: mongoose.Types.ObjectId;
  locationName?: string;
  name?: string;
  secretToken?: string;
  streamType?: string;
  streamUrl?: string;
  status?: string;
}

const CameraSchema = new Schema<ICamera>(
  {
    cameraKey: {
      type: String,
      required: [true, "Camera Key is required"],
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    locationName: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    secretToken: {
      type: String,
    },
    streamType: {
      type: String,
      default: "IP_WEBCAM",
    },
    streamUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "ONLINE",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Camera || mongoose.model<ICamera>("Camera", CameraSchema);
