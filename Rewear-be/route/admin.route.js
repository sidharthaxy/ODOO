import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireRole } from "../middleware/requireRole.js";
import { Product } from "../models/products.model.js";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();

router.get(
  "/stats",
  protectRoute,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const [pendingCount, activeCount, totalTransactions, totalUsers] = await Promise.all([
        Product.countDocuments({ status: "PENDING" }),
        Product.countDocuments({ status: "APPROVED", available: true }),
        Transaction.countDocuments({}),
        User.countDocuments({})
      ]);

      res.status(200).json({
        success: true,
        stats: {
          pendingItems: pendingCount,
          activeItems: activeCount,
          totalTransactions,
          totalUsers
        }
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// GET /api/v1/admin/pending-items
router.get("/pending-items", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const pendingItems = await Product.find({ status: "PENDING" }).populate("owner", "username email");
    res.status(200).json({ success: true, pendingItems });
  } catch (error) {
    console.error("Error fetching pending items", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/v1/admin/approve-item/:id
router.put("/approve-item/:id", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, { status: "APPROVED" }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, message: "Item approved", item });
  } catch (error) {
    console.error("Error approving item", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/v1/admin/reject-item/:id
router.put("/reject-item/:id", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, { status: "REJECTED" }, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, message: "Item rejected", item });
  } catch (error) {
    console.error("Error rejecting item", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/v1/admin/active-items
router.get("/active-items", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const activeItems = await Product.find({ status: "APPROVED", available: true }).populate("owner", "username email");
    res.status(200).json({ success: true, activeItems });
  } catch (error) {
    console.error("Error fetching active items", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/v1/admin/unlist-item/:id
router.put("/unlist-item/:id", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const item = await Product.findByIdAndUpdate(
      req.params.id, 
      { available: false, status: "REJECTED", flagReason: "Unlisted by Admin" }, 
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, message: "Item unlisted successfully", item });
  } catch (error) {
    console.error("Error unlisting item", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/v1/admin/admins
router.get("/admins", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const admins = await User.find({ role: "ADMIN" }).select("_id username email createdAt");
    res.status(200).json({ success: true, admins });
  } catch (error) {
    console.error("Error fetching admins", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/v1/admin/search-user
router.get("/search-user", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email query parameter is required" });
    
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("_id username email createdAt role");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error searching user", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/v1/admin/add-admin
router.post("/add-admin", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    
    // Find the user and update their role
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: "ADMIN" },
      { new: true }
    ).select("_id username email createdAt");

    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found with that email" });
    
    res.status(200).json({ success: true, message: "Admin added successfully", admin: updatedUser });
  } catch (error) {
    console.error("Error adding admin", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/v1/admin/remove-admin/:id
router.post("/remove-admin/:id", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const targetUserId = req.params.id;
    
    // Prevent an admin from demoting themselves
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot remove your own admin privileges" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { role: "USER" },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "Admin privileges removed successfully" });
  } catch (error) {
    console.error("Error removing admin", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;