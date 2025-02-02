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



export { createBlog };
