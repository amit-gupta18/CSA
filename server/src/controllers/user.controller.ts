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
    console.log("user id is : ", userId);
    let {
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

    year = parseInt(year, 10);
    cgpa = parseFloat(cgpa);

    // Validation guard
    if (educationLevel === "HIGHER_EDUCATION" && (isNaN(year) || isNaN(cgpa))) {
      return res.status(400).json({ error: "Year & CGPA must be number" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    console.log("user is : ", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if (user.educationLevel) {
    //   return res.status(400).json({ message: "User already onboarded" });
    // }

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
    return res.status(500).json({
      error: error,
      message: "Internal server error"
    });
  }
};


export const login = async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  if (!process.env.JWT_SECRET_KEY) {
    return res.status(500).json({ error: "Internal Server Error" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
  return res.status(200).json({ message: "user logged in successfully", id: user.id, email: user.email, token });
};