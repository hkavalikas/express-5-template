import { eq } from 'drizzle-orm';
import { db } from '../../common/db';
import { comments } from '../../common/db/schema';
import { Comment, CreateComment } from './schemas/schemas';

export class CommentRepository {
  async findAll(): Promise<Comment[]> {
    return db.select().from(comments);
  }

  async findById(id: string): Promise<Comment | null> {
    const result = await db.select().from(comments).where(eq(comments.id, id));
    return result.length > 0 ? result[0] : null;
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    return db.select().from(comments).where(eq(comments.postId, postId));
  }

  async create(commentData: CreateComment): Promise<Comment> {
    const result = await db
      .insert(comments)
      .values({
        postId: commentData.postId,
        content: commentData.content,
        author: commentData.author,
      })
      .returning();

    return result[0];
  }

  async update(
    id: string,
    commentData: Partial<CreateComment>
  ): Promise<Comment | null> {
    const result = await db
      .update(comments)
      .set(commentData)
      .where(eq(comments.id, id))
      .returning();

    return result.length > 0 ? result[0] : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();
    return result.length > 0;
  }
}
