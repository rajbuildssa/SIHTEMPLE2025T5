import express from "express";
import Temple from "../models/Temple.js";

export default (io) => {
  const router = express.Router();

  // ✅ Get all temples
  router.get("/", async (req, res) => {
    try {
      const temples = await Temple.find();
      res.json(temples.map(t => ({
        id: t._id,
        name: t.name,
        location: t.location,
        image: t.image,
        capacity: t.capacity,
        openTime: t.openTime,
        closeTime: t.closeTime,
        ticketPrices: t.ticketPrices,
        visitors: t.visitors
      })));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ✅ Increment visitors (simulate entry)
  router.post("/:id/visit", async (req, res) => {
    try {
      const temple = await Temple.findById(req.params.id);
      if (!temple) return res.status(404).json({ error: "Temple not found" });

      temple.visitors += 1;
      await temple.save();

      // 🔴 Emit real-time update for admin dashboard
      io.emit("visitorUpdate", {
        templeId: temple._id,
        visitors: temple.visitors
      });

      res.json(temple);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ✅ Create new temple (admin use only)
  router.post("/", async (req, res) => {
    try {
      const temple = new Temple(req.body);
      await temple.save();
      res.status(201).json(temple);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
};
