import { signup, login,logout } from "../controllers/auth";
import express from "express";
import authMiddleware  from "../middleware/auth";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

export default router;