import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const postsArraySchema = z.array(postSchema);

export type CreatePost = z.infer<typeof createPostSchema>;
export type Post = z.infer<typeof postSchema>;
