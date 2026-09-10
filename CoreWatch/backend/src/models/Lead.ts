import mongoose, { Schema } from "mongoose";

const LeadSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the lead name"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "proposal", "won", "lost"],
      default: "new",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lead", LeadSchema);
