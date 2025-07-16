import { PostRepository } from './PostRepository';
import {
  Post,
  CreatePost,
  postSchema,
  postsArraySchema,
} from './schemas/schemas';

export class PostService {
  constructor(private postRepository: PostRepository) {}

  async getAllPosts(): Promise<Post[]> {
    const posts = await this.postRepository.findAll();
    return postsArraySchema.parse(posts);
  }

  async getPostById(id: string): Promise<Post | null> {
    const post = await this.postRepository.findById(id);
    if (!post) return null;

    return postSchema.parse(post);
  }

  async createPost(postData: CreatePost): Promise<Post> {
    const createdPost = await this.postRepository.create(postData);
    return postSchema.parse(createdPost);
  }

  async updatePost(
    id: string,
    postData: Partial<CreatePost>
  ): Promise<Post | null> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) return null;

    const updatedPost = await this.postRepository.update(id, postData);
    if (!updatedPost) return null;

    return postSchema.parse(updatedPost);
  }

  async deletePost(id: string): Promise<boolean> {
    const existingPost = await this.postRepository.findById(id);
    if (!existingPost) return false;

    return await this.postRepository.delete(id);
  }
}
