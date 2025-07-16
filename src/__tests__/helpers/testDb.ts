import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { posts, comments } from '../../common/db/schema';

export const createTestDb = () => {
  const client = createClient({
    url: ':memory:',
  });

  const db = drizzle(client);

  // Create tables
  client.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  client.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  return { db, client };
};

export const cleanupDb = async (db: ReturnType<typeof createTestDb>['db']) => {
  await db.delete(comments);
  await db.delete(posts);
};

export const seedTestData = async (
  db: ReturnType<typeof createTestDb>['db']
) => {
  // Insert test posts
  const testPosts = await db
    .insert(posts)
    .values([
      {
        title: 'Test Post 1',
        content: 'This is test post 1 content',
      },
      {
        title: 'Test Post 2',
        content: 'This is test post 2 content',
      },
    ])
    .returning();

  // Insert test comments
  const testComments = await db
    .insert(comments)
    .values([
      {
        content: 'Test comment 1',
        author: 'Test Author 1',
        postId: testPosts[0].id,
      },
      {
        content: 'Test comment 2',
        author: 'Test Author 2',
        postId: testPosts[0].id,
      },
    ])
    .returning();

  return { testPosts, testComments };
};
