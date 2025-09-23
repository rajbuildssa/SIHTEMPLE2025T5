import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
  devoteeName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  age: Number, // Add age field
  tickets: {
    regular: Number,
    vip: Number,
    senior: Number
  },
  totalPrice: Number,
  qrCode: String,
  paymentStatus: { type: String, default: "pending" }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
