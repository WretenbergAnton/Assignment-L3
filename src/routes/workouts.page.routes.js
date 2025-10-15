import { Router } from "express";
import { requireAuthPage } from "../middlewares/pageAuth.middleware.js";
import { WorkoutController } from "../controllers/WorkoutController.js";

const router = Router();
const controller = new WorkoutController();

router.use(requireAuthPage);

router.post("/create-with-set", (req, res, next) => 
  controller.createWithSet(req, res, next)
);

router.delete("/:id", (req, res, next) => 
  controller.deleteWorkout(req, res, next)
);

export default router;