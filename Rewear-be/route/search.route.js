import express from "express";
import { User } from "../models/user.model.js";
import { Product } from "../models/products.model.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { upload } from "../middleware/upload.js"; // 🔹 Cloudinary upload middleware

const router = express.Router();

// POST /api/v1/search/add
router.post("/add", protectRoute, upload.single("image"), async (req, res) => {
	try {
		const { title, description, points } = req.body;
		const product_image = req.file?.path; // 🔹 Cloudinary auto URL

		if (!product_image || !title || !description || points == null) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// 1. Add to user's searchHistory
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		const searchItem = { product_image, title, description, points };
		user.searchHistory.push(searchItem);
		await user.save();

		// 2. Also add to global products list
		const product = new Product(searchItem);
		await product.save();

		res.status(200).json({ message: "Added to searchHistory & public products", product });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

export default router;
