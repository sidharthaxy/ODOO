import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/products.model.js";
import { Transaction } from "../models/transaction.model.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

// 1. Redeem Points for an Item
router.post("/redeem/:itemId", protectRoute, async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Product.findById(itemId);

    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    if (!item.available) return res.status(400).json({ success: false, message: "Item is no longer available" });
    if (item.status !== "APPROVED") return res.status(400).json({ success: false, message: "Item is not approved for redemption" });
    if (item.owner.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: "Cannot redeem your own item" });

    const requiredPoints = item.points;

    // ATOMIC CONCURRENCY HANDLING: Find the user ONLY if they have enough points, and decrement in the same call.
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, points: { $gte: requiredPoints } },
      { $inc: { points: -requiredPoints } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ success: false, message: "Insufficient points" });
    }

    // ATOMIC CONCURRENCY: Lock the item to prevent double-redemption
    const updatedItem = await Product.findOneAndUpdate(
      { _id: itemId, available: true },
      { available: false },
      { new: true }
    );

    if (!updatedItem) {
      // Revert the points deduction if the item got taken!
      await User.findByIdAndUpdate(req.user._id, { $inc: { points: requiredPoints } });
      return res.status(400).json({ success: false, message: "Item was snatched by someone else!" });
    }

    // Give points to the owner
    await User.findByIdAndUpdate(item.owner, { $inc: { points: requiredPoints } });

    // Record the transaction
    const transaction = new Transaction({
      type: "REDEEM",
      status: "COMPLETED",
      sender: req.user._id,
      receiver: item.owner,
      item: itemId,
      points: requiredPoints,
    });
    await transaction.save();

    res.status(200).json({ success: true, message: "Redeemed successfully", transaction });
  } catch (error) {
    console.error("Error in redeemItem", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 2. Request a Swap
router.post("/swap/request", protectRoute, async (req, res) => {
  try {
    const { targetItemId, offeredItemId } = req.body;

    if (!targetItemId || !offeredItemId) return res.status(400).json({ success: false, message: "Target and offered items are required" });

    const targetItem = await Product.findById(targetItemId);
    const offeredItem = await Product.findById(offeredItemId);

    if (!targetItem || !offeredItem) return res.status(404).json({ success: false, message: "Items not found" });
    if (!targetItem.available || !offeredItem.available) return res.status(400).json({ success: false, message: "One or both items are unavailable" });
    if (targetItem.owner.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: "Cannot target your own item" });
    if (offeredItem.owner.toString() !== req.user._id.toString()) return res.status(400).json({ success: false, message: "You don't own the offered item" });

    // Prevent duplicate pending swap request for same items
    const existingSwap = await Transaction.findOne({
      sender: req.user._id,
      item: targetItemId,
      offeredItem: offeredItemId,
      status: "PENDING"
    });
    if (existingSwap) {
      return res.status(400).json({ success: false, message: "A swap request for these items is already pending" });
    }

    // ATOMIC CONCURRENCY: Lock offered item from being redeemed while in swap
    const lockedOfferedItem = await Product.findOneAndUpdate(
      { _id: offeredItemId, available: true },
      { available: false },
      { new: true }
    );
    if (!lockedOfferedItem) {
      return res.status(400).json({ success: false, message: "Your item is already locked in another transaction" });
    }

    // Creating pending swap request
    const transaction = new Transaction({
      type: "SWAP",
      status: "PENDING",
      sender: req.user._id,
      receiver: targetItem.owner,
      item: targetItemId,
      offeredItem: offeredItemId,
    });
    await transaction.save();

    res.status(200).json({ success: true, message: "Swap request sent", transaction });
  } catch (error) {
    console.error("Error in requestSwap", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 3. Accept a Swap Request
router.post("/swap/:transactionId/accept", protectRoute, async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Find pending swap meant for this User
    const transaction = await Transaction.findOne({ _id: transactionId, receiver: req.user._id, type: "SWAP", status: "PENDING" });
    if (!transaction) return res.status(404).json({ success: false, message: "Pending swap request not found" });

    // ATOMIC CONCURRENCY: Lock target item
    const lockedTargetItem = await Product.findOneAndUpdate(
      { _id: transaction.item, available: true },
      { available: false },
      { new: true }
    );

    if (!lockedTargetItem) {
      // Release offered item back to available
      await Product.findByIdAndUpdate(transaction.offeredItem, { available: true });
      transaction.status = "CANCELLED";
      await transaction.save();
      return res.status(400).json({ success: false, message: "Your item is no longer available" });
    }

    // Perform ownership swap natively
    await Product.findByIdAndUpdate(transaction.item, { owner: transaction.sender, available: true });
    await Product.findByIdAndUpdate(transaction.offeredItem, { owner: req.user._id, available: true });

    transaction.status = "COMPLETED";
    await transaction.save();

    res.status(200).json({ success: true, message: "Swap accepted and items exchanged", transaction });
  } catch (error) {
    console.error("Error in acceptSwap", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 4. Reject/Cancel Swap Request
router.post("/swap/:transactionId/reject", protectRoute, async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Can be rejected by receiver or cancelled by sender
    const transaction = await Transaction.findOne({
      _id: transactionId,
      status: "PENDING",
      type: "SWAP",
      $or: [{ receiver: req.user._id }, { sender: req.user._id }]
    });

    if (!transaction) return res.status(404).json({ success: false, message: "Pending swap request not found" });

    // Free up the offered item which was locked
    await Product.findByIdAndUpdate(transaction.offeredItem, { available: true });

    transaction.status = (transaction.receiver.toString() === req.user._id.toString()) ? "REJECTED" : "CANCELLED";
    await transaction.save();

    res.status(200).json({ success: true, message: "Swap " + transaction.status.toLowerCase(), transaction });
  } catch (error) {
    console.error("Error in rejectSwap", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 5. Get My Pending Swap Requests (Where I am the receiver)
router.get("/my-swaps", protectRoute, async (req, res) => {
  try {
    const pendingSwaps = await Transaction.find({
      receiver: req.user._id,
      type: "SWAP",
      status: "PENDING"
    })
      .populate("item", "title images points")
      .populate("offeredItem", "title images points")
      .populate("sender", "username email");

    res.status(200).json({ success: true, pendingSwaps });
  } catch (error) {
    console.error("Error fetching pending swaps", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 6. Get Sent Swap Requests (Where I am the sender)
router.get("/my-sent-swaps", protectRoute, async (req, res) => {
  try {
    const sentSwaps = await Transaction.find({
      sender: req.user._id,
      type: "SWAP"
    })
      .populate("item", "title images points")
      .populate("offeredItem", "title images points")
      .populate("receiver", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, sentSwaps });
  } catch (error) {
    console.error("Error fetching sent swaps", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 7. Get ALL Transactions (Admin Only)
router.get("/all", protectRoute, requireRole("ADMIN"), async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate("sender", "username email")
      .populate("receiver", "username email")
      .populate("item", "title images points")
      .populate("offeredItem", "title images points")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching all transactions", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
