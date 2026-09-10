import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  maxCameras: number; // Replaces maxUsers
  trialDays: number;
  status: "active" | "inactive";
  sortOrder: number;
  isPopular: boolean;
  features: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    monthlyPrice: {
      type: Number,
      required: [true, "Monthly price is required"],
      min: [0, "Monthly price cannot be negative"],
    },
    yearlyPrice: {
      type: Number,
      required: [true, "Yearly price is required"],
      min: [0, "Yearly price cannot be negative"],
    },
    maxCameras: {
      type: Number,
      required: [true, "Max cameras is required"],
      min: [1, "Max cameras must be at least 1"],
    },
    trialDays: {
      type: Number,
      default: 0,
      min: [0, "Trial days cannot be negative"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    features: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model<IPlan>("Plan", planSchema);
