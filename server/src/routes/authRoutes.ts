import express from "express"
const authRouter = express.Router();

import { registerUser } from "../controllers/user.controller.js";

authRouter.post("/register", registerUser);

export default authRouter;
