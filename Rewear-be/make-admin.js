import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/rewear").then(async () => {
    const email = process.argv[2]?.toLowerCase().trim();
    if (!email) {
        console.log("Please provide a user email.");
        console.log("Usage: node make-admin.js <user-email>");
        process.exit(1);
    }
    
    const res = await User.findOneAndUpdate({ email }, { role: "ADMIN" }, { new: true });
    
    if (res) {
        console.log(`Success! User ${email} is now an ADMIN.`);
    } else {
        console.log(`User with email ${email} not found.`);
    }
    
    process.exit(0);
}).catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
});
