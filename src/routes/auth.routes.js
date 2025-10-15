import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

const authRouter = Router();
const controller = new AuthController();

authRouter.post('/sign-in', (req, res, next) => controller.signIn(req, res, next));
authRouter.post('/sign-up', (req, res, next) => controller.signUp(req, res, next));
authRouter.post('/sign-out', (req, res, next) => controller.signOut(req, res, next));

export default authRouter;