import { CommentService } from '../../api/comments/CommentService';
import { CommentRepository } from '../../api/comments/CommentRepository';
import { PostRepository } from '../../api/posts/PostRepository';
import { AppError } from '../../common/middleware/errorHandler';

// Mock the repositories
jest.mock('../../api/comments/CommentRepository');
jest.mock('../../api/posts/PostRepository');
const MockedCommentRepository = CommentRepository as jest.MockedClass<
  typeof CommentRepository
>;
const MockedPostRepository = PostRepository as jest.MockedClass<
  typeof PostRepository
>;

describe('CommentService', () => {
  let commentService: CommentService;
  let mockCommentRepository: jest.Mocked<CommentRepository>;
  let mockPostRepository: jest.Mocked<PostRepository>;

  beforeEach(() => {
    mockCommentRepository =
      new MockedCommentRepository() as jest.Mocked<CommentRepository>;
    mockPostRepository =
      new MockedPostRepository() as jest.Mocked<PostRepository>;
    commentService = new CommentService(
      mockCommentRepository,
      mockPostRepository
    );
  });

  describe('getAllComments', () => {
    it('should return all comments', async () => {
      const mockComments = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          content: 'Comment 1',
          author: 'Author 1',
          postId: '550e8400-e29b-41d4-a716-446655440010',
          createdAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          content: 'Comment 2',
          author: 'Author 2',
          postId: '550e8400-e29b-41d4-a716-446655440010',
          createdAt: new Date(),
        },
      ];
      mockCommentRepository.findAll.mockResolvedValue(mockComments);

      const result = await commentService.getAllComments();

      expect(result).toEqual(mockComments);
      expect(mockCommentRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCommentById', () => {
    it('should return a comment by id', async () => {
      const mockComment = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Comment 1',
        author: 'Author 1',
        postId: '550e8400-e29b-41d4-a716-446655440010',
        createdAt: new Date(),
      };
      mockCommentRepository.findById.mockResolvedValue(mockComment);

      const result = await commentService.getCommentById(
        '550e8400-e29b-41d4-a716-446655440000'
      );

      expect(result).toEqual(mockComment);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000'
      );
    });

    it('should return null when comment not found', async () => {
      mockCommentRepository.findById.mockResolvedValue(null);

      const result = await commentService.getCommentById(
        '550e8400-e29b-41d4-a716-446655440000'
      );

      expect(result).toBeNull();
    });
  });

  describe('getCommentsByPostId', () => {
    it('should return comments for a specific post', async () => {
      const mockPost = {
        id: '550e8400-e29b-41d4-a716-446655440010',
        title: 'Post 1',
        content: 'Content 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockComments = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          content: 'Comment 1',
          author: 'Author 1',
          postId: '550e8400-e29b-41d4-a716-446655440010',
          createdAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          content: 'Comment 2',
          author: 'Author 2',
          postId: '550e8400-e29b-41d4-a716-446655440010',
          createdAt: new Date(),
        },
      ];

      mockPostRepository.findById.mockResolvedValue(mockPost);
      mockCommentRepository.findByPostId.mockResolvedValue(mockComments);

      const result = await commentService.getCommentsByPostId(
        '550e8400-e29b-41d4-a716-446655440010'
      );

      expect(result).toEqual(mockComments);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440010'
      );
      expect(mockCommentRepository.findByPostId).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440010'
      );
    });

    it('should throw AppError when post not found', async () => {
      mockPostRepository.findById.mockResolvedValue(null);

      await expect(
        commentService.getCommentsByPostId(
          '550e8400-e29b-41d4-a716-446655440010'
        )
      ).rejects.toThrow(AppError);
      await expect(
        commentService.getCommentsByPostId(
          '550e8400-e29b-41d4-a716-446655440010'
        )
      ).rejects.toHaveProperty('statusCode', 404);
    });
  });

  describe('createComment', () => {
    it('should create a new comment', async () => {
      const commentData = {
        content: 'New Comment',
        author: 'New Author',
        postId: '550e8400-e29b-41d4-a716-446655440010',
      };
      const mockPost = {
        id: '550e8400-e29b-41d4-a716-446655440010',
        title: 'Post 1',
        content: 'Content 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockCreatedComment = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...commentData,
        createdAt: new Date(),
      };

      mockPostRepository.findById.mockResolvedValue(mockPost);
      mockCommentRepository.create.mockResolvedValue(mockCreatedComment);

      const result = await commentService.createComment(commentData);

      expect(result).toEqual(mockCreatedComment);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440010'
      );
      expect(mockCommentRepository.create).toHaveBeenCalledWith(commentData);
    });

    it('should throw AppError when post not found during creation', async () => {
      const commentData = {
        content: 'New Comment',
        author: 'New Author',
        postId: '550e8400-e29b-41d4-a716-446655440010',
      };
      mockPostRepository.findById.mockResolvedValue(null);

      await expect(commentService.createComment(commentData)).rejects.toThrow(
        AppError
      );
      await expect(
        commentService.createComment(commentData)
      ).rejects.toHaveProperty('statusCode', 404);
    });
  });

  describe('updateComment', () => {
    it('should update an existing comment', async () => {
      const commentData = { content: 'Updated Comment' };
      const existingComment = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Original Comment',
        author: 'Author 1',
        postId: '550e8400-e29b-41d4-a716-446655440010',
        createdAt: new Date(),
      };
      const mockUpdatedComment = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Updated Comment',
        author: 'Author 1',
        postId: '550e8400-e29b-41d4-a716-446655440010',
        createdAt: new Date(),
      };

      mockCommentRepository.findById.mockResolvedValue(existingComment);
      mockCommentRepository.update.mockResolvedValue(mockUpdatedComment);

      const result = await commentService.updateComment(
        '550e8400-e29b-41d4-a716-446655440000',
        commentData
      );

      expect(result).toEqual(mockUpdatedComment);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000'
      );
      expect(mockCommentRepository.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        commentData
      );
    });

    it('should return null when comment not found during update', async () => {
      const commentData = { content: 'Updated Comment' };
      mockCommentRepository.findById.mockResolvedValue(null);

      const result = await commentService.updateComment(
        '550e8400-e29b-41d4-a716-446655440000',
        commentData
      );

      expect(result).toBeNull();
    });
  });

  describe('deleteComment', () => {
    it('should delete an existing comment', async () => {
      const existingComment = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        content: 'Comment to delete',
        author: 'Author 1',
        postId: '550e8400-e29b-41d4-a716-446655440010',
        createdAt: new Date(),
      };

      mockCommentRepository.findById.mockResolvedValue(existingComment);
      mockCommentRepository.delete.mockResolvedValue(true);

      const result = await commentService.deleteComment(
        '550e8400-e29b-41d4-a716-446655440000'
      );

      expect(result).toBe(true);
      expect(mockCommentRepository.findById).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000'
      );
      expect(mockCommentRepository.delete).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000'
      );
    });

    it('should return false when comment not found during deletion', async () => {
      mockCommentRepository.findById.mockResolvedValue(null);

      const result = await commentService.deleteComment(
        '550e8400-e29b-41d4-a716-446655440000'
      );

      expect(result).toBe(false);
    });
  });
});
