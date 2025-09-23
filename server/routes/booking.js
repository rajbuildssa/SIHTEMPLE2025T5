import express from "express";
import Ticket from "../models/Ticket.js";
import Temple from "../models/Temple.js";
import QRCode from "qrcode";
import emailService from "../utils/emailService.js";

const router = express.Router();

// List all bookings (temporary, no auth)
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("temple").sort({ createdAt: 1 });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Create a new booking (ticket) - non-Stripe fallback/demo
router.post("/", async (req, res) => {
  try {
    const { templeId, formData, tickets } = req.body; // formData from DevoteeDetailsForm

    const temple = await Temple.findById(templeId);
    if (!temple) return res.status(404).json({ message: "Temple not found" });

    const counts = tickets || { regular: 1, vip: 0, senior: 0 };
    const totalPrice =
      (counts.regular || 0) * (temple.ticketPrices?.regular || 0) +
      (counts.vip || 0) * (temple.ticketPrices?.vip || 0) +
      (counts.senior || 0) * (temple.ticketPrices?.senior || 0);

    const devoteeName = formData?.primaryDevotee?.name || "Unknown";
    const email = formData?.primaryDevotee?.email || "unknown@example.com";
    const phone = formData?.primaryDevotee?.phone || "";
    const age = formData?.primaryDevotee?.age;

    const ticket = await Ticket.create({
      temple: temple._id,
      devoteeName,
      email,
      phone,
      age,
      tickets: counts,
      totalPrice,
      paymentStatus: "paid" // mark as paid in demo mode
    });

    const qrPayload = {
      bookingId: ticket._id.toString(),
      temple: temple.name,
      devoteeName,
      tickets: counts
    };

    ticket.qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload));
    await ticket.save();

    // Send booking confirmation email
    try {
      await emailService.sendBookingConfirmation(ticket, temple);
      console.log('Booking confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// Test email endpoint
router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const success = await emailService.sendTestEmail(email);
    if (success) {
      res.json({ message: "Test email sent successfully" });
    } else {
      res.status(500).json({ message: "Failed to send test email" });
    }
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({ message: "Test email failed" });
  }
});

// Get a booking (ticket) by id
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("temple");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
});

export default router;
