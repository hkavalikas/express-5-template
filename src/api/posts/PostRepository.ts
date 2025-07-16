import { eq } from 'drizzle-orm';
import { db } from '../../common/db';
import { posts } from '../../common/db/schema';
import { Post, CreatePost } from './schemas/schemas';

export class PostRepository {
  async findAll(): Promise<Post[]> {
    return db.select().from(posts);
  }

  async findById(id: string): Promise<Post | null> {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result.length > 0 ? result[0] : null;
  }

  async create(postData: Omit<CreatePost, 'id'>): Promise<Post> {
    const result = await db
      .insert(posts)
      .values({
        title: postData.title,
        content: postData.content,
      })
      .returning();

    return result[0];
  }

  async update(
    id: string,
    postData: Partial<CreatePost>
  ): Promise<Post | null> {
    const result = await db
      .update(posts)
      .set({
        ...postData,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();

    return result.length > 0 ? result[0] : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id)).returning();
    return result.length > 0;
  }
}
