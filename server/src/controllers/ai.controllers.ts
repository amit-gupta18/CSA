import { generatequestion } from "../services/ai.services.js"
import type { Request , Response } from "express";



export const generateQuestion = async (req : Request , res : Response) => {
    const { interests } = req.body;
    try {
        const questions = await generatequestion();
        res.json(questions);
    } catch (error) {
        console.error("Error generating questions:", error);
        res.status(500).json({ error: "Failed to generate questions" });
    }
}