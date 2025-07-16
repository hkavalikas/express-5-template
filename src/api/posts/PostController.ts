import { Request, Response } from 'express';
import { PostService } from './PostService';
import { createPostSchema, CreatePost } from './schemas/schemas';
import { ZodError } from 'zod';
import { idParamSchema } from '../../common/schemas/schema';

export class PostController {
  constructor(private postService: PostService) {}

  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.postService.getAllPosts();
      res.json(posts);
    } catch {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const post = await this.postService.getPostById(id);

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to fetch post' });
      }
    }
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body);
      const validatedData: CreatePost = createPostSchema.parse(req.body);
      const post = await this.postService.createPost(validatedData);

      res.status(201).json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create post' });
      }
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData: Partial<CreatePost> = createPostSchema
        .partial()
        .parse(req.body);

      const post = await this.postService.updatePost(id, validatedData);

      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to update post' });
      }
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const deleted = await this.postService.deletePost(id);

      if (!deleted) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to delete post' });
      }
    }
  }
}
