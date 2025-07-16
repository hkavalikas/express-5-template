import { z } from 'zod';

export const postIdParamSchema = z.object({
  postId: z.string().uuid('Invalid post ID format'),
});

export const createCommentSchema = z.object({
  postId: z.string().uuid('Invalid post ID format'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
});

export const commentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  content: z.string(),
  author: z.string(),
  createdAt: z.date(),
});

export const commentsArraySchema = z.array(commentSchema);

export type CreateComment = z.infer<typeof createCommentSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type PostIdParam = z.infer<typeof postIdParamSchema>;
