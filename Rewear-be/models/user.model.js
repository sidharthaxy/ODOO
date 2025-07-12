import mongoose from "mongoose";

// Define schema for each search history item
const searchItemSchema = new mongoose.Schema({
	product_image: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	points: { type: Number, required: true }
}, { _id: true }); // `_id` will be auto-included by default

// Define user schema
const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		default: "",
	},
	searchHistory: {
		type: [searchItemSchema],
		default: [],
	},
});

export const User = mongoose.model("User", userSchema);
