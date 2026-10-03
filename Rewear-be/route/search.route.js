import express from "express";
import { User } from "../models/user.model.js";
import { Product } from "../models/products.model.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { upload } from "../middleware/upload.js"; // 🔹 Cloudinary upload middleware

const router = express.Router();

// POST /api/v1/search/add
// Note: We use upload.array("images", 5) to support up to 5 images
router.post("/add", protectRoute, upload.array("images", 5), async (req, res) => {
	try {
		const { title, description, points, type, size, category, condition, tags } = req.body;
		
        // If files were uploaded, map them to an array of URLs
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => file.path);
        } else if (req.body.images) {
            // Frontend might send base64 or URLs directly depending on setup
            images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        }

		const parsedPoints = Number(points) > 0 ? Number(points) : 50;

		if (images.length === 0 || !title || !description || !category || !condition || !size) {
			return res.status(400).json({ success: false, message: "Required fields are missing (title, description, category, size, condition, images)" });
		}

		// 1. Add to user's searchHistory
		const user = await User.findById(req.user._id);
		if (!user) return res.status(404).json({ success: false, message: "User not found" });

		const searchItem = { images, title, description, points: parsedPoints };
		user.searchHistory.push(searchItem);
		await user.save();

		// 2. Also add to global products list
        // Parse tags if they came as a string
        let parsedTags = [];
        if (tags) {
            try {
                parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
            } catch (e) {
                parsedTags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
            }
        }

		const product = new Product({
			...searchItem,
			type: type || "",
			size,
            category,
            condition,
            tags: parsedTags,
			owner: user._id,
			status: "PENDING",
			available: true,
			flagged: false
		});
		await product.save();

		res.status(201).json({ success: true, message: "Item submitted for approval", product });
	} catch (error) {
		console.error("Error adding product:", error);
		res.status(500).json({ success: false, message: error.message || "Server error" });
	}
});

// GET /api/v1/search/my-items
router.get("/my-items", protectRoute, async (req, res) => {
	try {
        const items = await Product.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, items });
    } catch (error) {
        console.error("Error fetching user items", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// DELETE /api/v1/search/item/:id
router.delete("/item/:id", protectRoute, async (req, res) => {
    try {
        const item = await Product.findOne({ _id: req.params.id, owner: req.user._id });
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found or you are not authorized to delete it" });
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Item removed successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET /api/v1/search/all
// Fetch all approved and available items with optional search, category, condition, and sort filters
router.get("/all", async (req, res) => {
    try {
        const { category, condition, search, sort } = req.query;
        const query = { status: "APPROVED", available: true };

        if (category && category !== "All") {
            query.category = new RegExp(`^${category}$`, "i");
        }

        if (condition && condition !== "All") {
            query.condition = new RegExp(`^${condition}$`, "i");
        }

        if (search && search.trim()) {
            const term = search.trim();
            query.$or = [
                { title: { $regex: term, $options: "i" } },
                { description: { $regex: term, $options: "i" } },
                { tags: { $in: [new RegExp(term, "i")] } },
                { category: { $regex: term, $options: "i" } }
            ];
        }

        let sortOption = { createdAt: -1 };
        if (sort === "points-asc") sortOption = { points: 1 };
        if (sort === "points-desc") sortOption = { points: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };

        const items = await Product.find(query)
            .populate("owner", "username image email")
            .sort(sortOption);

        res.status(200).json({ success: true, items });
    } catch (error) {
        console.error("Error fetching all items", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET /api/v1/search/related/:id
// Fetch up to 4 related items in similar category, excluding current item
router.get("/related/:id", async (req, res) => {
    try {
        const currentItem = await Product.findById(req.params.id);
        if (!currentItem) return res.status(404).json({ success: false, message: "Item not found" });

        let related = await Product.find({
            _id: { $ne: currentItem._id },
            status: "APPROVED",
            available: true,
            category: currentItem.category
        }).limit(3);

        if (related.length < 3) {
            const additional = await Product.find({
                _id: { $nin: [currentItem._id, ...related.map(r => r._id)] },
                status: "APPROVED",
                available: true
            }).limit(3 - related.length);
            related = [...related, ...additional];
        }

        res.status(200).json({ success: true, related });
    } catch (error) {
        console.error("Error fetching related items:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET /api/v1/search/:id
// Fetch a single item by its ID
router.get("/:id", async (req, res) => {
    try {
        const item = await Product.findById(req.params.id).populate("owner", "username image email");
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });
        res.status(200).json({ success: true, item });
    } catch (error) {
        console.error("Error fetching item", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
