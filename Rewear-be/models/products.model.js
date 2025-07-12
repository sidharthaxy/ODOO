//id,product_image,title,description,points
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_image: {
    type: String,
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
  points: {
    type: Number,
    required: true,
  },
  type:  {
    type: String,
    required: true,
  },
  size:  {
    type: String,
    required: true,
  }

}, { timestamps: true }); // adds createdAt, updatedAt

export const Product = mongoose.model("Product", productSchema);
