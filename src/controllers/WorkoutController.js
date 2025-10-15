import { WorkoutService } from "../services/WorkoutService.js";

/**
 * Controller for workout-related operations.
 * Handles HTTP requests and delegates business logic to WorkoutService.
 */
export class WorkoutController {
  /**
   * Create a workout with a single set
   */
  async createWithSet(req, res, next) {
    try {
      const { date, type, exerciseName, kind } = req.body;
      const reps = Number(req.body.reps);
      const weightKg = Number(req.body.weightKg);
      const distanceKm = Number(req.body.distanceKm);
      const minutes = Number(req.body.minutes || 0);
      const seconds = Number(req.body.seconds || 0);

      const service = new WorkoutService(req.user._id);

      const doc = await service.createWorkoutWithSet({
        date,
        type,
        exerciseName,
        setData: { kind, reps, weightKg, distanceKm, minutes, seconds }
      });

      return req.accepts("html")
        ? res.redirect("/dashboard")
        : res.json({ success: true, data: doc });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete a workout
   */
  async deleteWorkout(req, res, next) {
    try {
      const service = new WorkoutService(req.user._id);
      const result = await service.deleteWorkout(req.params.id);

      if (!result) {
        return req.accepts("html")
          ? res.redirect("/dashboard")
          : res.status(404).json({ success: false, message: "Not found" });
      }

      return req.accepts("html")
        ? res.redirect("/dashboard")
        : res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  /**
   * View a single workout with details
   */
  async viewWorkout(req, res, next) {
    try {
      const service = new WorkoutService(req.user._id);
      const workout = await service.getWorkoutById(req.params.id);

      if (!workout) {
        return res.redirect("/dashboard");
      }

      const stats = await service.getWorkoutStats(req.params.id);

      res.render("workouts/viewWorkout", {
        title: "View Workout",
        workout,
        stats
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get dashboard with enriched workout data
   */
  async getDashboard(req, res, next) {
    try {
      const service = new WorkoutService(req.user._id);
      const items = await service.getAllWorkoutsWithStats();

      res.render("dashboard", {
        title: "Dashboard",
        items
      });
    } catch (err) {
      next(err);
    }
  }
}