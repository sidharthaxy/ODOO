import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["SWAP", "REDEEM"],
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "CANCELLED", "REJECTED"],
    default: "PENDING",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    // For a swap, this is the other user. For a redeem, could be null or admin system
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  item: {
    // The item the sender wants to acquire (for both SWAP and REDEEM)
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  offeredItem: {
    // The item the sender is offering (only for SWAP)
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  points: {
    // The points being transferred (for REDEEM)
    type: Number,
  }
}, { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);
