import { Router } from "express";
import { requireAuthPage } from "../middlewares/pageAuth.middleware.js";
import { WorkoutController } from "../controllers/WorkoutController.js";
import Workout from "../models/workout.model.js";

const router = Router();
const workoutController = new WorkoutController();

// Public routes
router.get("/", (_req, res) => res.redirect("/login"));
router.get("/login", (_req, res) => res.render("auth/sign-in", { title: "Login" }));
router.get("/register", (_req, res) => res.render("auth/sign-up", { title: "Register" }));

// Protected routes
router.get("/dashboard", requireAuthPage, (req, res, next) => 
  workoutController.getDashboard(req, res, next)
);

router.get("/workout", requireAuthPage, async (req, res, next) => {
  try {
    const items = await Workout.find({ user: req.user._id }).sort({ date: -1 }).lean();
    res.render("workouts/addWorkout", { title: "New Workout", items });
  } catch (err) {
    next(err);
  }
});

// View single workout
router.get("/workouts/:id", requireAuthPage, (req, res, next) =>
  workoutController.viewWorkout(req, res, next)
);

export default router;