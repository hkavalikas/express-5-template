import { Request, Response } from 'express';
import { CommentService } from './CommentService';
import {
  createCommentSchema,
  postIdParamSchema,
  CreateComment,
} from './schemas/schemas';
import { idParamSchema } from '../../common/schemas/schema';
import { createCustomError } from '../../common/middleware/errorHandler';

export class CommentController {
  constructor(private commentService: CommentService) {}

  getAllComments = async (req: Request, res: Response): Promise<void> => {
    const comments = await this.commentService.getAllComments();
    res.json(comments);
  };

  getCommentById = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const comment = await this.commentService.getCommentById(id);

    if (!comment) {
      throw createCustomError('Comment not found', 404);
    }

    res.json(comment);
  };

  getCommentsByPostId = async (req: Request, res: Response): Promise<void> => {
    const { postId } = postIdParamSchema.parse(req.params);
    const comments = await this.commentService.getCommentsByPostId(postId);

    res.json(comments);
  };

  createComment = async (req: Request, res: Response): Promise<void> => {
    const validatedData: CreateComment = createCommentSchema.parse(req.body);
    const comment = await this.commentService.createComment(validatedData);

    res.status(201).json(comment);
  };

  updateComment = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const validatedData: Partial<CreateComment> = createCommentSchema
      .partial()
      .parse(req.body);

    const comment = await this.commentService.updateComment(id, validatedData);

    if (!comment) {
      throw createCustomError('Comment not found', 404);
    }

    res.json(comment);
  };

  deleteComment = async (req: Request, res: Response): Promise<void> => {
    const { id } = idParamSchema.parse(req.params);
    const deleted = await this.commentService.deleteComment(id);

    if (!deleted) {
      throw createCustomError('Comment not found', 404);
    }

    res.status(204).send();
  };
}
