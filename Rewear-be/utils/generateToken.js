import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, ENV_VARS.JWT_TOKEN, { expiresIn: "15d" });

	res.cookie("rewear-jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks, make it not be accessed by JS
	//	sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		sameSite: "none", // CSRF attacks cross-site request forgery attacks
		secure: true, // only send cookie over HTTPS
	});

	return token;
};
