import { Router } from 'express';
import { PostController } from './PostController';
import { PostService } from './PostService';
import { PostRepository } from './PostRepository';
import { asyncHandler } from '../../common/middleware/errorHandler';

export function createPostRoutes(): Router {
  const router = Router();

  const postRepository = new PostRepository();
  const postService = new PostService(postRepository);
  const postController = new PostController(postService);

  router.get('/', asyncHandler(postController.getAllPosts));
  router.get('/:id', asyncHandler(postController.getPostById));
  router.post('/', asyncHandler(postController.createPost));
  router.put('/:id', asyncHandler(postController.updatePost));
  router.delete('/:id', asyncHandler(postController.deletePost));

  return router;
}
