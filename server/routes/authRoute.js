import express from "express";
import { requireAuth } from "../utils/clerkAuth.js";

const router = express.Router();

// Apply Clerk middleware to all auth routes
router.use(requireAuth);

// Test route to verify auth is working
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes working" });
});

// Get current user info
router.get("/user", (req, res) => {
  if (req.user) {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

export default router;
