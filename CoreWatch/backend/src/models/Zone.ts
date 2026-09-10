import mongoose, { Schema, Document } from "mongoose";

export interface IZone extends Document {
  companyId?: string;
  shopId?: mongoose.Types.ObjectId;
  cameraId: string;
  name: string;
  nameNormalized: string;
  type: "RESTRICTED" | "VALUABLE" | "CASH_COUNTER" | "STORAGE" | "DOOR" | "CUSTOM";
  points: { x: number; y: number }[];
  enabled: boolean;
  rules: {
    alertAfterSeconds: number;
    enabled: boolean;
    afterHoursOnly: boolean;
  };
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ZoneSchema = new Schema<IZone>(
  {
    companyId: {
      type: String,
      trim: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    cameraId: {
      type: String,
      required: [true, "Camera ID is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Zone name is required"],
      trim: true,
    },
    nameNormalized: {
      type: String,
      required: [true, "Normalized name is required"],
      trim: true,
      lowercase: true,
    },
    type: {
      type: String,
      required: [true, "Zone type is required"],
      enum: ["RESTRICTED", "VALUABLE", "CASH_COUNTER", "STORAGE", "DOOR", "CUSTOM"],
    },
    points: [
      {
        x: {
          type: Number,
          required: true,
        },
        y: {
          type: Number,
          required: true,
        },
      },
    ],
    enabled: {
      type: Boolean,
      default: true,
    },
    rules: {
      alertAfterSeconds: {
        type: Number,
        default: 5,
        min: [1, "alertAfterSeconds must be at least 1"],
        max: [300, "alertAfterSeconds cannot exceed 300"],
      },
      enabled: {
        type: Boolean,
        default: true,
      },
      afterHoursOnly: {
        type: Boolean,
        default: false,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index on cameraId and nameNormalized to prevent duplicate names on the same camera
ZoneSchema.index({ cameraId: 1, nameNormalized: 1 }, { unique: true });
ZoneSchema.index({ companyId: 1 });
ZoneSchema.index({ shopId: 1 });

export default mongoose.models.Zone || mongoose.model<IZone>("Zone", ZoneSchema);
