import type { Request, Response } from "express";
import prisma from "../prisma/prismaClient";

interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
        email: string;
      };

  }

  
  const createComment = async (req: Request, res: Response) => {
    const { blogId, content } = req.body;
    const userId = (req as AuthRequest).user?.id;

    console.log("Debug - userId:", userId);
    console.log("Debug - blogId:", blogId);
    console.log("Debug - content:", content);

    
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
    }


    if (!blogId || !content) {
        return res.status(400).json({ message: "Blog ID and content are required" });
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                content: content,
                blogId: String(blogId), 
                userId: userId, 
            },
        });

        res.status(201).json({ message: "Comment created", comment });
    } catch (err) {
        console.error("Comment creation error:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

  const getComments = async (req: Request, res: Response) => {
    const { id: blogId } = req.params;

    
    if (!blogId) {
        return res.status(400).json({ message: "Blog ID is required" });
    }

    try {
        const comments = await prisma.comment.findMany({
            where: { blogId: String(blogId) },
            include: {
                user: { select: { username: true, email: true } }, 
            },
        });

        res.status(200).json({ comments });
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

  
  
export { createComment, getComments };
