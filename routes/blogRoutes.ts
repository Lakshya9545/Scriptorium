import express from "express";
import authMiddleware from "../middleware/auth";
import { createBlog,getAllBlogs,getBlogById,updateBlog,deleteBlog } from "../controllers/blog";

const router = express.Router();

router.post("/createBlog", authMiddleware, createBlog);
router.get("/allBlogs", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);


export default router;
