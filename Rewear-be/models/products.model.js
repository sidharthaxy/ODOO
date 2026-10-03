//id,product_image,title,description,points
import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  flagReason: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  points: {
    type: Number,
    required: true,
  },
  type:  {
    type: String,
  },
  size:  {
    type: String,
    required: true,
  }

}, { timestamps: true }); // adds createdAt, updatedAt

export const Product = mongoose.model("Product", productSchema);
