import type { Request, Response } from "express";
import prisma from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { error } from "console";

dotenv.config();

// first page when the user register the user registeration page . 
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, educationlevel } = req.body;

    if (!email || !password || !educationlevel) {
      return res.status(400).json({ error: "email, password, educationLevel required" });
    }

    // const existing = await prisma.user.findUnique({ where: { email } });
    // if (existing) {
    //   return res.status(409).json({ error: "User already exists" });
    // }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashed,
        educationlevel: educationlevel
      },
    });



    // generate the jwt token over here
    if (!process.env.JWT_SECRET_KEY) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
    // setting up the cookies here
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 3600 * 1000 }); 
    return res.status(201).json({ id: user.id, email: user.email, educationLevel: user.educationlevel, token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" , error: err});
  }
};

// // this page is onboarding page when the user just signup they would have to go through the onboarding page to fulfill the data . 

export const onboardingUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    console.log("user id is : ", userId);
    let {
      name,
      educationlevel,
      branch,
      year,
      cgpa
    } = req.body;

    year = parseInt(year, 10);
    cgpa = parseFloat(cgpa);

    // Validation guard
    if (educationlevel === "HIGHER_EDUCATION" && (isNaN(year) || isNaN(cgpa))) {
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
        educationlevel,
        branch,
        year,
        cgpa
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
  const { email , password } = req.body

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


// ================= REGISTER =================
// export const registerUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password , educationLevel } = req.body;

//     if (!email || !password || !educationLevel)  {
//       return res.status(400).json({ error: "All fields required" });
//     }

//     // Check if user exists
//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//         educationLevel,
//       },
//     });

//     if (!process.env.JWT_SECRET_KEY) {
//       throw new Error("JWT_SECRET_KEY not set in env");
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
//       expiresIn: "7d",
//     });

//     return res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: user.id,
//         email: user.email,
//         educationLevel: user.educationLevel,
//       },
//       token,
//     });
//   } catch (err) {
//     console.error("Register error:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// // ================= LOGIN =================
// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password required" });
//     }

//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         password: true, // Include password for comparison
//       },
//     });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     if (!process.env.JWT_SECRET_KEY) {
//       throw new Error("JWT_SECRET_KEY not set in env");
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
//       expiresIn: "7d",
//     });

//     return res.status(200).json({
//       message: "Login successful",
//       user: { id: user.id, email: user.email, name: user.name },
//       token,
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
