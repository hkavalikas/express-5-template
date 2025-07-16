import { Router } from 'express';
import { PostController } from './PostController';
import { PostService } from './PostService';
import { PostRepository } from './PostRepository';

export function createPostRoutes(): Router {
  const router = Router();

  const postRepository = new PostRepository();
  const postService = new PostService(postRepository);
  const postController = new PostController(postService);

  router.get('/', (req, res) => postController.getAllPosts(req, res));
  router.get('/:id', (req, res) => postController.getPostById(req, res));
  router.post('/', (req, res) => postController.createPost(req, res));
  router.put('/:id', (req, res) => postController.updatePost(req, res));
  router.delete('/:id', (req, res) => postController.deletePost(req, res));

  return router;
}
