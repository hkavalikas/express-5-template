import { Request, Response } from 'express';
import { CommentService } from './CommentService';
import { createCommentSchema, postIdParamSchema, CreateComment } from './schemas/schemas';
import { ZodError } from 'zod';
import {idParamSchema} from "../../common/schemas/schema";

export class CommentController {
  constructor(private commentService: CommentService) {}

  async getAllComments(req: Request, res: Response): Promise<void> {
    try {
      const comments = await this.commentService.getAllComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const comment = await this.commentService.getCommentById(id);
      
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to fetch comment' });
      }
    }
  }

  async getCommentsByPostId(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = postIdParamSchema.parse(req.params);
      const comments = await this.commentService.getCommentsByPostId(postId);
      
      res.json(comments);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else if (error instanceof Error && error.message === 'Post not found') {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.status(500).json({ error: 'Failed to fetch comments' });
      }
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const validatedData: CreateComment = createCommentSchema.parse(req.body);
      const comment = await this.commentService.createComment(validatedData);
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else if (error instanceof Error && error.message === 'Post not found') {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.status(500).json({ error: 'Failed to create comment' });
      }
    }
  }

  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validatedData: Partial<CreateComment> = createCommentSchema.partial().parse(req.body);
      
      const comment = await this.commentService.updateComment(id, validatedData);
      
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else if (error instanceof Error && error.message === 'Post not found') {
        res.status(404).json({ error: 'Post not found' });
      } else {
        res.status(500).json({ error: 'Failed to update comment' });
      }
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params);
      const deleted = await this.commentService.deleteComment(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to delete comment' });
      }
    }
  }
}