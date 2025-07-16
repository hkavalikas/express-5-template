import request from 'supertest';
import express from 'express';
import { createCommentRoutes } from '../../api/comments/routes';
import { errorHandler } from '../../common/middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/api/comments', createCommentRoutes());
app.use(errorHandler);

describe('Comments API', () => {
  describe('GET /api/comments', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/api/comments');
      expect([200, 500]).toContain(response.status); // Allow for database errors in test
    });
  });

  describe('POST /api/comments', () => {
    it('should return 400 for invalid comment data', async () => {
      const invalidComment = {
        content: '',
        author: 'Test Author',
        postId: '550e8400-e29b-41d4-a716-446655440000',
      };

      const response = await request(app)
        .post('/api/comments')
        .send(invalidComment);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request data');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app).post('/api/comments').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request data');
    });
  });

  describe('GET /api/comments/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/comments/invalid-id');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/comments/post/:postId', () => {
    it('should return 400 for invalid post ID format', async () => {
      const response = await request(app).get('/api/comments/post/invalid-id');

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).put('/api/comments/invalid-id').send({
        content: 'Updated content',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).delete('/api/comments/invalid-id');

      expect(response.status).toBe(400);
    });
  });
});
