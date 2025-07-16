import { Router } from 'express';
import { CommentController } from './CommentController';
import { CommentService } from './CommentService';
import { CommentRepository } from './CommentRepository';
import { PostRepository } from '../posts/PostRepository';
import { wrapAsyncRoutes } from '../../common/middleware/errorHandler';

export function createCommentRoutes(): Router {
  const router = wrapAsyncRoutes(Router());

  const commentRepository = new CommentRepository();
  const postRepository = new PostRepository();
  const commentService = new CommentService(commentRepository, postRepository);
  const commentController = new CommentController(commentService);

  router.get('/', commentController.getAllComments);
  router.get('/:id', commentController.getCommentById);
  router.get('/post/:id', commentController.getCommentsByPostId);
  router.post('/', commentController.createComment);
  router.put('/:id', commentController.updateComment);
  router.delete('/:id', commentController.deleteComment);

  return router;
}
