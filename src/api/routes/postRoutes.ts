import { Router } from 'express';
import { PostController } from '../posts/PostController';
import { PostService } from '../posts/PostService';
import { PostRepository } from '../posts/PostRepository';

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