import type { Request, Response } from "express";
import prisma from "../prisma/prismaClient";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
});
interface AuthRequest extends Request {
    user?: { id: string };
  }

const createBlog = async (req: Request, res: Response) => {
  const parseResult = blogSchema.safeParse(req.body);
  if (!parseResult.success)
    return res.status(400).json({ errors: parseResult.error.errors });

  try {
    const { title, content } = parseResult.data;
    const userId = (req as AuthRequest).user?.id; 
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    const blog = await prisma.blog.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          authorId: userId ?? "", 
        },
      });

    res.status(201).json({ message: "Blog created", blog });
  } catch (err) {
    console.error("Create Blog Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: { username: true, email: true }, 
        },
      },
    });

    res.json({ blogs });
  } catch (err) {
    console.error("Get Blogs Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { author: { select: { id: true, username: true } } }, // Include author details
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

 const updateBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const existingBlog = await prisma.blog.findUnique({ where: { id } });
        if (!existingBlog) return res.status(404).json({ message: "Blog not found" });


        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: { title, content, updatedAt: new Date() }
        });

        res.json({ message: "Blog updated", updatedBlog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

 const deleteBlog = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;

      
      const existingBlog = await prisma.blog.findUnique({ where: { id } });
      if (!existingBlog) return res.status(404).json({ message: "Blog not found" });

      await prisma.blog.delete({ where: { id } });

      res.json({ message: "Blog deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
  }
};



  

export { createBlog, getAllBlogs,getBlogById,updateBlog,deleteBlog };
