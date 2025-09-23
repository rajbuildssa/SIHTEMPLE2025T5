// models/Booking.js
const mongoose = require('mongoose');

const DevoteeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

const BookingSchema = new mongoose.Schema({
  templeId: { type: String, required: true },
  templeName: { type: String, required: true },
  numberOfTickets: { type: Number, required: true },
  primaryDevotee: {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String },
  },
  additionalDevotees: [DevoteeSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', BookingSchema);
