import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { WorkoutController } from "../controllers/WorkoutController.js";

const workoutRouter = Router();
const controller = new WorkoutController();

workoutRouter.use(authorize);

workoutRouter.post("/create-with-set", (req, res, next) => 
  controller.createWithSet(req, res, next)
);

workoutRouter.delete("/:id", (req, res, next) => 
  controller.deleteWorkout(req, res, next)
);

export default workoutRouter;