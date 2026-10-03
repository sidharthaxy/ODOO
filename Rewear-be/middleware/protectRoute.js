import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
		const token = req.cookies["rewear-jwt"] || bearerToken;

		if (!token) {
			return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
		}

		const decoded = jwt.verify(token, ENV_VARS.JWT_TOKEN);

		if (!decoded || !decoded.userId) {
			return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
			return res.status(401).json({ success: false, message: "Unauthorized - Invalid or expired token" });
		}
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};
