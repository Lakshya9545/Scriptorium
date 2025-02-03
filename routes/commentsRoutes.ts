import { Router } from 'express';
import { createComment, getComments } from '../controllers/comments.ts';
import authMiddleware from "../middleware/auth";
const router = Router();

router.post('/comments',authMiddleware, createComment);
router.get('/blogs/:id/comments', getComments);

export default router;
