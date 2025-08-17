import type { Request, Response } from "express";
import prisma from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

// first page when the user register the user registeration page . 
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, educationLevel } = req.body;

        if (!name || !email || !password || !educationLevel) {
            return res.status(400).json({ error: "email, password, educationLevel required" });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashed,
                educationLevel: educationLevel
            },
        });


        // generate the jwt token over here
        if (!process.env.JWT_SECRET_KEY) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
        return res.status(201).json({ id: user.id, email: user.email, educationLevel: user.educationLevel, token: token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

// this page is onboarding page when the user just signup they would have to go through the onboarding page to fulfill the data . 

export const onboardingUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; 
    const {
      name,
      dob,
      educationLevel,
      grade,
      board,
      branch,
      year,
      cgpa,
      college,
    } = req.body;


    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.educationLevel) {
      return res.status(400).json({ message: "User already onboarded" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        dob: dob ? new Date(dob) : null,
        educationLevel,
        grade,
        board,
        branch,
        year,
        cgpa,
        college,
      },
    });

    return res.status(200).json({
      message: "Onboarding completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
