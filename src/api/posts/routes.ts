import { Router } from 'express';
import { PostController } from './PostController';
import { PostService } from './PostService';
import { PostRepository } from './PostRepository';
import { wrapAsyncRoutes } from '../../common/middleware/errorHandler';

export function createPostRoutes(): Router {
  const router = wrapAsyncRoutes(Router());

  const postRepository = new PostRepository();
  const postService = new PostService(postRepository);
  const postController = new PostController(postService);

  router.get('/', postController.getAllPosts);
  router.get('/:id', postController.getPostById);
  router.post('/', postController.createPost);
  router.put('/:id', postController.updatePost);
  router.delete('/:id', postController.deletePost);

  return router;
}
