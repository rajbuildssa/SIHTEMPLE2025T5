import mongoose from "mongoose";

const templeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  image: String,
  capacity: Number,
  openTime: String,
  closeTime: String,
  ticketPrices: {
    regular: Number,
    vip: Number,
    senior: Number
  },
  currentVisitors: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Temple", templeSchema);
