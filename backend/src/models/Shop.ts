import mongoose, { Schema, Document } from "mongoose";

export interface IShop extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  address?: string;
  activeNightGuard?: boolean;
}

const ShopSchema = new Schema<IShop>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner association is required"],
    },
    name: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
    },
    address: {
      type: String,
      default: "",
    },
    activeNightGuard: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Shop || mongoose.model<IShop>("Shop", ShopSchema);
