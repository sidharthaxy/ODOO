import express from "express";
import { ENV_VARS } from "./config/envVars.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./route/auth.route.js";
import { connectDB } from "./config/db.js";
import searchRoutes from "./route/search.route.js";
const app = express();
const PORT = ENV_VARS.PORT;

// import { protectRoute } from "./middleware/protectRoute.js";


app.use(express.json());
app.use(cookieParser());

// const cors = require('cors');

app.use(cors({
  origin: '*', // allow all 
}));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/search", searchRoutes);

app.listen(PORT, () => {
	console.log("Server started at http://localhost:" + PORT);
	connectDB();
});
console.log("server started at port", PORT);