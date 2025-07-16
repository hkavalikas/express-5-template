import { z } from 'zod';

 const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

 const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

 const postsArraySchema = z.array(postSchema);

 type CreatePost = z.infer<typeof createPostSchema>;
 type Post = z.infer<typeof postSchema>;

 export { createPostSchema, postSchema, postsArraySchema };
 export type { CreatePost, Post}