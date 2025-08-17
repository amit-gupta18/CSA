import express from "express"
const authRouter = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware.js";

import { registerUser , onboardingUser } from "../controllers/user.controller.js";

authRouter.post("/register", registerUser);
authRouter.post("/onboard" , authMiddleware , onboardingUser );

export default authRouter;
