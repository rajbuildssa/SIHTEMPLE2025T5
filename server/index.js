import 'dotenv/config';
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import templeRoutes from "./routes/templeRoutes.js";
import paymentRoutes from "./routes/paymentRoute.js";
import authRoutes from "./routes/authRoute.js";
import bookingRoutes from "./routes/booking.js"; // <-- new
// Ensure env is loaded regardless of CWD (support root .env and server/.env)
try {
  const cwdEnvLoaded = !!process.env.STRIPE_SECRET_KEY;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  if (!cwdEnvLoaded) {
    // Try root .env (one level up from server/)
    const rootEnvPath = path.join(__dirname, '..', '.env');
    await import('dotenv').then(({ default: dotenv }) => dotenv.config({ path: rootEnvPath }));
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    // Try server/.env as a last resort
    const serverEnvPath = path.join(__dirname, '.env');
    await import('dotenv').then(({ default: dotenv }) => dotenv.config({ path: serverEnvPath }));
  }
} catch {}

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sih_temple';

app.use(cors());
// Stripe webhook requires the raw body. Mount a raw parser for that path before JSON parser.
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

// Routes
app.use("/api/temples", templeRoutes(io)); // pass io for real-time updates
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes); // <-- new route

app.get("/api/health", (req, res) => res.json({ status: "Server running" }));

// Temporary endpoint to seed temple data
app.post("/api/seed-temples", async (req, res) => {
  try {
    const Temple = (await import("./models/Temple.js")).default;

    // Check if temples already exist
    const existingCount = await Temple.countDocuments();
    if (existingCount > 0) {
      return res.status(400).json({ error: "Temples already exist" });
    }

    const sampleTemples = [
      {
        name: "Dwarkadhish Temple",
        location: "Dwarka, Gujarat",
        image: "https://is.zobj.net/image-server/v1/images?r=O-HndYx03texUjmLtO8NO9cjWUoeAvoLtd5CQ3mBxxprww3u06f2XQs2jqaAEo2Oylg-Pt_X54HJb6sBHAmfge51ZHtCt6VAAEH37-Fx6E_i4bR8FkXjenraRJm0pX-hiY4EtcHC0fPUlZzZ5vFbf0meDgaFOBLU_g3M9icuLOLu51cInsZ48ofmp5Q1zdHkVeIrSKKTfemwfvphfxntdXtzHCcbuGw4rKtBL_hzLjdWZMuro-1CwhPwkvE",
        capacity: 500,
        openTime: "05:00",
        closeTime: "21:00",
        ticketPrices: {
          regular: 50,
          vip: 200,
          senior: 25
        },
        currentVisitors: 0
      },
      {
        name: "Somnath Temple",
        location: "Somnath, Gujarat",
        image: "https://is.zobj.net/image-server/v1/images?r=9FJrXokpZDEIb4uza69c-ZOg9vR5bJfjnLfL-Ya5QIutvCFODqDzj94IFAbqj89v3nn-a8656DofsJEksTLVfeA3GykLdaa61kEFK4wIEXSIb8OFBK5ER2dGTjORHqAJFnrLNPpohehOGG2MQFFpsNvw_KObMcFuNPpuQH4tgKwpoX6lN3nxP7soDh88ZSlPbZpLO4Iq1i_UiWF1DSZSL-ydB2KujK3KIAvxFqdlcVNd3OzCmBTWPMEW0yc",
        capacity: 400,
        openTime: "06:00",
        closeTime: "20:00",
        ticketPrices: {
          regular: 30,
          vip: 150,
          senior: 15
        },
        currentVisitors: 0
      },
      {
        name: "Pavagadh Temple",
        location: "Pavagadh Hill, Gujarat",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPwn5B78JSphl3S32nVswhb3vhWsF9iFqZtA&s",
        capacity: 400,
        openTime: "05:00",
        closeTime: "19:00",
        ticketPrices: {
          regular: 50,
          vip: 150,
          senior: 25
        },
        currentVisitors: 0
      }
    ];

    const temples = await Temple.insertMany(sampleTemples);
    res.status(201).json({
      message: `Seeded ${temples.length} temples successfully`,
      temples: temples.map(t => ({ id: t._id, name: t.name }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------
// Socket.IO for Admin Dashboard
// ------------------------
io.on("connection", (socket) => {
  console.log("Admin connected:", socket.id);

  // Optional: listen for custom events from admin frontend
  socket.on("requestVisitorData", async () => {
    console.log("Admin requested visitor data");
    // You can fetch all temples and send current visitor counts
    const Temple = (await import("./models/Temple.js")).default;
    const temples = await Temple.find();
    socket.emit(
      "initialVisitorData",
      temples.map(t => ({ templeId: t._id, visitors: t.visitors }))
    );
  });

  socket.on("disconnect", () => {
    console.log("Admin disconnected:", socket.id);
  });
});

// DB + Start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err?.message || err);
  });
