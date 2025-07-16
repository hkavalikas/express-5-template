import { PostService } from '../../api/posts/PostService';
import { PostRepository } from '../../api/posts/PostRepository';

// Mock the repository
jest.mock('../../api/posts/PostRepository');
const MockedPostRepository = PostRepository as jest.MockedClass<
  typeof PostRepository
>;

describe('PostService', () => {
  let postService: PostService;
  let mockPostRepository: jest.Mocked<PostRepository>;

  beforeEach(() => {
    mockPostRepository =
      new MockedPostRepository() as jest.Mocked<PostRepository>;
    postService = new PostService(mockPostRepository);
  });

  describe('getAllPosts', () => {
    it('should return all posts', async () => {
      const mockPosts = [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Post 1',
          content: 'Content 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          title: 'Post 2',
          content: 'Content 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPostRepository.findAll.mockResolvedValue(mockPosts);

      const result = await postService.getAllPosts();

      expect(result).toEqual(mockPosts);
      expect(mockPostRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      mockPostRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(postService.getAllPosts()).rejects.toThrow('Database error');
    });
  });

  describe('getPostById', () => {
    it('should return a post by id', async () => {
      const mockPost = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Post 1',
        content: 'Content 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPostRepository.findById.mockResolvedValue(mockPost);

      const result = await postService.getPostById(
        '550e8400-e29b-41d4-a716-446655440000'
      );

      expect(result).toEqual(mockPost);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000'
      );
    });

    it('should return null when post not found', async () => {
      mockPostRepository.findById.mockResolvedValue(null);

      const result = await postService.getPostById(
        '550e8400-e29b-41d4-a716-446655440000'
      );

      expect(result).toBeNull();
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const postData = { title: 'New Post', content: 'New Content' };
      const mockCreatedPost = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPostRepository.create.mockResolvedValue(mockCreatedPost);

      const result = await postService.createPost(postData);

      expect(result).toEqual(mockCreatedPost);
      expect(mockPostRepository.create).toHaveBeenCalledWith(postData);
    });

    it('should handle repository errors during creation', async () => {
      const postData = { title: 'New Post', content: 'New Content' };
      mockPostRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(postService.createPost(postData)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('updatePost', () => {
    it('should update an existing post', async () => {
      const postData = { title: 'Updated Post', content: 'Updated Content' };
      const existingPost = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Original Post',
        content: 'Original Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockUpdatedPost = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPostRepository.findById.mockResolvedValue(existingPost);
      mockPostRepository.update.mockResolvedValue(mockUpdatedPost);

      const result = await postService.updatePost(
        '550e8400-e29b-41d4-a716-446655440000',
        postData
      );

      expect(result).toEqual(mockUpdatedPost);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000'
      );
      expect(mockPostRepository.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        postData
      );
    });

    it('should return null when post not found during update', async () => {
      const postData = { title: 'Updated Post', content: 'Updated Content' };
      mockPostRepository.findById.mockResolvedValue(null);

      const result = await postService.updatePost(
        '550e8400-e29b-41d4-a716-446655440000',
        postData
      );

      expect(result).toBeNull();
    });
  });

  describe('deletePost', () => {
    it('should delete an existing post', async () => {
      const existingPost = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Existing Post',
        content: 'Existing Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPostRepository.findById.mockResolvedValue(existingPost);
      mockPostRepository.delete.mockResolvedValue(true);

      const result = await postService.deletePost(
        '550e8400-e29b-41d4-a716-446655440000'
      );

      expect(result).toBe(true);
      expect(mockPostRepository.findById).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000'
      );
      expect(mockPostRepository.delete).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000'
      );
    });

    it('should return false when post not found during deletion', async () => {
      mockPostRepository.findById.mockResolvedValue(null);

      const result = await postService.deletePost(
        '550e8400-e29b-41d4-a716-446655440000'
      );

      expect(result).toBe(false);
    });
  });
});
