import type { Request, Response } from "express"; 
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const signupSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signup = async (req: Request, res: Response) => {
  const parseResult = signupSchema.safeParse(req.body);
  if (!parseResult.success)
    return res.status(400).json({ errors: parseResult.error.errors });

  const { username, email, password } = parseResult.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    res
      .status(201)
      .json({ message: "User created", user: { id: newUser.id, email } });
  } catch (err) {
    console.error("Signup Error:", err); 
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success)
    return res.status(400).json({ errors: parseResult.error.errors });

  const { email, password } = parseResult.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error("login Error:", err); 
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req: Request, res: Response) => {
    try {
        
        res.clearCookie("token").json({ message: "Logged out" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
        console.error("logout Error:", err); 
    }
    };

// Exporting the functions properly
export { signup, login, logout };
