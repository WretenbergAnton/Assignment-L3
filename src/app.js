import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";

import { PORT } from "./config/env.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import workoutRouter from "./routes/workout.routes.js";

import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { requireAuthPage } from "./middlewares/pageAuth.middleware.js";

const app = express();

// --- EJS + layouts setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
// Dina vyer ligger i src/views
app.set("views", path.join(__dirname, "views"));

// Aktivera layouts (default = views/layout.ejs)
app.use(expressLayouts);
app.set("layout", "layout");

// Statiska filer (t.ex. CSS) i src/public
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/login", (req, res) => res.render("auth/sign-in", { title: "Login" }));
app.get("/register", (req, res) =>
  res.render("auth/sign-up", { title: "Register" })
);
app.get("/dashboard", requireAuthPage, (req, res) => {
  const initial = req.user?.username?.trim?.()[0]?.toUpperCase?.() ?? "?";
  res.render("dashboard", {
    title: "Dashboard",
    user: req.user,
    initial,
    items: [
      { name: "Bench Press", date: "2025-10-02", type: "strength" },
      { name: "Run", date: "2025-10-01", type: "endurance" },
    ],
  });
});

app.get("/wokouts", requireAuthPage);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/workouts", workoutRouter);

// --- Root ---
app.get("/", (req, res) => res.redirect("/login"));

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(
    `Subscription Tracker API is running on http://localhost:${PORT}`
  );
  await connectToDatabase();
});

export default app;
