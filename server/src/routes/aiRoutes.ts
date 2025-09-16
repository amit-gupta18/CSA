import express from "express";
const aiRouter = express.Router();
import { generateQuestion } from "../controllers/ai.controllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


aiRouter.post("/generate-question", authMiddleware ,  generateQuestion);



export default aiRouter;    