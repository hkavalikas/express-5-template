import { CommentRepository } from './CommentRepository';
import { PostRepository } from '../posts/PostRepository';
import {
  Comment,
  CreateComment,
  commentSchema,
  commentsArraySchema,
} from './schemas/schemas';

export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private postRepository: PostRepository
  ) {}

  async getAllComments(): Promise<Comment[]> {
    const comments = await this.commentRepository.findAll();
    return commentsArraySchema.parse(comments);
  }

  async getCommentById(id: string): Promise<Comment | null> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) return null;

    return commentSchema.parse(comment);
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const postExists = await this.postRepository.findById(postId);
    if (!postExists) {
      throw new Error('Post not found');
    }

    const comments = await this.commentRepository.findByPostId(postId);
    return commentsArraySchema.parse(comments);
  }

  async createComment(commentData: CreateComment): Promise<Comment> {
    const postExists = await this.postRepository.findById(commentData.postId);
    if (!postExists) {
      throw new Error('Post not found');
    }

    const createdComment = await this.commentRepository.create(commentData);
    return commentSchema.parse(createdComment);
  }

  async updateComment(
    id: string,
    commentData: Partial<CreateComment>
  ): Promise<Comment | null> {
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) return null;

    if (commentData.postId) {
      const postExists = await this.postRepository.findById(commentData.postId);
      if (!postExists) {
        throw new Error('Post not found');
      }
    }

    const updatedComment = await this.commentRepository.update(id, commentData);
    if (!updatedComment) return null;

    return commentSchema.parse(updatedComment);
  }

  async deleteComment(id: string): Promise<boolean> {
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) return false;

    return await this.commentRepository.delete(id);
  }
}
