import { z } from 'zod';

 const postIdParamSchema = z.object({
  postId: z.string().uuid('Invalid post ID format'),
});

 const createCommentSchema = z.object({
  postId: z.string().uuid('Invalid post ID format'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
});

 const commentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  content: z.string(),
  author: z.string(),
  createdAt: z.date(),
});

 const commentsArraySchema = z.array(commentSchema);

 type CreateComment = z.infer<typeof createCommentSchema>;
 type Comment = z.infer<typeof commentSchema>;

 export { postIdParamSchema, createCommentSchema, commentSchema, commentsArraySchema };
 export type { CreateComment, Comment}