import { Router } from 'express';
import { PostController } from './PostController';
import { PostService } from './PostService';
import { PostRepository } from './PostRepository';
import { asyncRouterWrapper } from '../../common/middleware/asyncMiddleware';

export function createPostRoutes(): Router {
  const router = asyncRouterWrapper(Router());

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
