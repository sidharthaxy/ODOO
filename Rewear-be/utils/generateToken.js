import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, ENV_VARS.JWT_TOKEN, { expiresIn: "15d" });

	const isProduction = ENV_VARS.NODE_ENV === "production";

	res.cookie("rewear-jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
		httpOnly: true, // prevent XSS attacks
		sameSite: isProduction ? "none" : "lax",
		secure: isProduction,
	});

	return token;
};
