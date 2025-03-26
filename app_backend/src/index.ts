import "./config/envLoader.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";
import UserRoutes from "./users/user.controller.js";
import restaurantRoutes from "./restaurants/restaurant.controller.js";
import cuisinesRoutes from "./cuisines/cuisine.controller.js";
import uploadRoutes from "./upload/upload.js";
import userRestaurantInteractionRoutes from "./userRestaurantInteraction/userRestaurantInteraction.controller.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());

// logging requests
app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

const mongoDbUrl = process.env.MONGODB_URL as string;
console.log("mongoDbUrl: ", mongoDbUrl);
mongoose
	.connect(mongoDbUrl)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Error connecting to MongoDB:", err));

const port = process.env.PORT;

app.listen(port, () => {
	console.log(`Running Environment: ${process.env.NODE_ENV}`);
	console.log(`Listening on port: ${port}`);
});

app.get("/health-check", (req, res) => {
	res.send("Health Check!");
});

app.use("/api/users", UserRoutes);
app.use("/api/cuisines", cuisinesRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user_restaurant_intercations", userRestaurantInteractionRoutes);
