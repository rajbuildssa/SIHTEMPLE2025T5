import express from "express";
import Stripe from "stripe";
import Ticket from "../models/Ticket.js";
import Temple from "../models/Temple.js";
import QRCode from "qrcode";
import emailService from "../utils/emailService.js";

const router = express.Router();
let stripeInstance = null;
function getStripe() {
  if (stripeInstance) return stripeInstance;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripeInstance = new Stripe(key, { apiVersion: '2024-06-20' });
  return stripeInstance;
}

// Create Checkout Session
router.post("/checkout", async (req, res) => {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).json({ message: "STRIPE_SECRET_KEY not configured" });
    }
    const { templeId, tickets, devoteeName, email, phone, age } = req.body;

    const temple = await Temple.findById(templeId);
    if (!temple) return res.status(404).json({ message: "Temple not found" });

    // Calculate total price
    const totalPrice =
      (tickets.regular || 0) * temple.ticketPrices.regular +
      (tickets.vip || 0) * temple.ticketPrices.vip +
      (tickets.senior || 0) * temple.ticketPrices.senior;

    // Create Ticket in DB with pending payment
    const ticket = await Ticket.create({
      temple: temple._id,
      devoteeName,
      email,
      phone,
      age: age,
      tickets,
      totalPrice,
      paymentStatus: "pending",
    });

    // Generate Stripe Checkout session
    const frontendUrl = process.env.FRONTEND_URL || "https://sihtemple-2025frontende.vercel.app";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: `${temple.name} Darshan Ticket` },
            unit_amount: totalPrice * 100, // in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontendUrl}/payment-success?ticket_id=${ticket._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/e-darshan-ticket-booking`,
      metadata: { ticketId: ticket._id.toString() },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Checkout session failed" });
  }
});

// Stripe Webhook
router.post(
  "/webhook",
  // Note: express.raw for this path is also mounted in server/index.js
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(500).send("Stripe is not configured");
    }

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const ticketId = session.metadata?.ticketId;
        if (!ticketId) {
          return res.status(400).send("Missing ticketId in session metadata");
        }
        const ticket = await Ticket.findById(ticketId).populate("temple");

        if (ticket) {
          ticket.paymentStatus = "paid";

          // Generate simple QR code with ticket ID and status
          const qrData = JSON.stringify({
            id: ticket._id,
            status: ticket.paymentStatus,
            name: ticket.devoteeName,
            temple: ticket.temple?.name
          });
          ticket.qrCode = await QRCode.toDataURL(qrData);

          await ticket.save();

          // Send booking confirmation email
          try {
            await emailService.sendBookingConfirmation(ticket, ticket.temple);
            console.log('Booking confirmation email sent successfully');
          } catch (emailError) {
            console.error('Failed to send booking confirmation email:', emailError);
            // Don't fail the webhook if email fails
          }
        }
      }

      return res.status(200).json({ received: true });
    } catch (e) {
      console.error("Error handling webhook:", e);
      return res.status(500).send("Internal error handling webhook");
    }
  }
);

// Confirm payment (client-side redirect helper): fetch ticket and return details
router.get("/confirm", async (req, res) => {
  try {
    const { ticket_id } = req.query;
    if (!ticket_id) return res.status(400).json({ message: "ticket_id required" });
    const ticket = await Ticket.findById(ticket_id).populate("temple");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    return res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
});

// Status endpoint to verify Stripe configuration without exposing the key
router.get("/status", (req, res) => {
  const key = process.env.STRIPE_SECRET_KEY || "";
  res.json({
    configured: Boolean(key),
    isTestKey: key.startsWith("sk_test_"),
  });
});

export default router;
