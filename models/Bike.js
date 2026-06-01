import { Schema, model } from "mongoose";

const BikeSchema = new Schema(
  {
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    name: {
      type: String,
      required: true,
    },
    plate: {
      type: String,
      required: true,
    },
    monthlyRate: {
      type: Number,
      required: true,
    },
    status: {
      enum: ["available", "rented"],
      type: String,
      required: true,
      default: "available",
    },
  },
  { timestamps: true },
);

export default model("Bike", BikeSchema);
