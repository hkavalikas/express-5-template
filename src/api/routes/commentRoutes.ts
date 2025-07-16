import { Router } from 'express';
import { CommentController } from '../comments/CommentController';
import { CommentService } from '../comments/CommentService';
import { CommentRepository } from '../comments/CommentRepository';
import { PostRepository } from '../posts/PostRepository';

export function createCommentRoutes(): Router {
  const router = Router();

  const commentRepository = new CommentRepository();
  const postRepository = new PostRepository();
  const commentService = new CommentService(commentRepository, postRepository);
  const commentController = new CommentController(commentService);

  router.get('/', (req, res) => commentController.getAllComments(req, res));
  router.get('/:id', (req, res) => commentController.getCommentById(req, res));
  router.get('/post/:postId', (req, res) =>
    commentController.getCommentsByPostId(req, res)
  );
  router.post('/', (req, res) => commentController.createComment(req, res));
  router.put('/:id', (req, res) => commentController.updateComment(req, res));
  router.delete('/:id', (req, res) =>
    commentController.deleteComment(req, res)
  );

  return router;
}
