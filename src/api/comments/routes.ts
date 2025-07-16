import { Router } from 'express';
import { CommentController } from './CommentController';
import { CommentService } from './CommentService';
import { CommentRepository } from './CommentRepository';
import { PostRepository } from '../posts/PostRepository';
import { asyncHandler } from '../../common/middleware/errorHandler';

export function createCommentRoutes(): Router {
  const router = Router();

  const commentRepository = new CommentRepository();
  const postRepository = new PostRepository();
  const commentService = new CommentService(commentRepository, postRepository);
  const commentController = new CommentController(commentService);

  router.get('/', asyncHandler(commentController.getAllComments));
  router.get('/:id', asyncHandler(commentController.getCommentById));
  router.get(
    '/post/:postId',
    asyncHandler(commentController.getCommentsByPostId)
  );
  router.post('/', asyncHandler(commentController.createComment));
  router.put('/:id', asyncHandler(commentController.updateComment));
  router.delete('/:id', asyncHandler(commentController.deleteComment));

  return router;
}
