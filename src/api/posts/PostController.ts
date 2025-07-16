import { Request, Response } from 'express';
import { PostService } from './PostService';
import { createPostSchema, CreatePost } from './schemas/schemas';
import { idParamSchema } from '../../common/schemas/schema';
import { createCustomError } from '../../common/middleware/errorHandler';

export class PostController {
  constructor(private postService: PostService) {}

  getAllPosts = async (req: Request, res: Response): Promise<void> => {
    const posts = await this.postService.getAllPosts();
    res.json(posts);
  };

  getPostById = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const post = await this.postService.getPostById(id);

    if (!post) {
      throw createCustomError('Post not found', 404);
    }

    res.json(post);
  };

  createPost = async (req: Request, res: Response): Promise<void> => {
    const validatedData: CreatePost = createPostSchema.parse(req.body);
    const post = await this.postService.createPost(validatedData);

    res.status(201).json(post);
  };

  updatePost = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const validatedData: Partial<CreatePost> = createPostSchema
      .partial()
      .parse(req.body);

    const post = await this.postService.updatePost(id, validatedData);

    if (!post) {
      throw createCustomError('Post not found', 404);
    }

    res.json(post);
  };

  deletePost = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const deleted = await this.postService.deletePost(id);

    if (!deleted) {
      throw createCustomError('Post not found', 404);
    }

    res.status(204).send();
  };
}
