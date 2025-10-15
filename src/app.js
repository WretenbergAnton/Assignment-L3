import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import methodOverride from "method-override";

import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";

// Routers
import authRouter from "./routes/auth.routes.js";
import workoutApiRouter from "./routes/workout.routes.js";
import pagesRouter from "./routes/page.routes.js";
import workoutsPageRouter from "./routes/workouts.page.routes.js";

const app = express();

// --- EJS + layouts setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// Parsers & utils
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// --- PAGES (cookie auth) ---
app.use("/", pagesRouter);
app.use("/workouts", workoutsPageRouter);

// --- APIs (Bearer token auth). Keep if you also want JSON APIs ---
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/workouts", workoutApiRouter);

// Error handler
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`Workout Tracker App is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
