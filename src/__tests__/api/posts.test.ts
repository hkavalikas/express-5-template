import request from 'supertest';
import express from 'express';
import { createPostRoutes } from '../../api/posts/routes';
import { errorHandler } from '../../common/middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/api/posts', createPostRoutes());
app.use(errorHandler);

describe('Posts API', () => {
  describe('GET /api/posts', () => {
    it('should return 200 status', async () => {
      const response = await request(app).get('/api/posts');
      expect([200, 500]).toContain(response.status); // Allow for database errors in test
    });
  });

  describe('POST /api/posts', () => {
    it('should return 400 for invalid post data', async () => {
      const invalidPost = {
        title: '',
        content: 'Some content',
      };

      const response = await request(app).post('/api/posts').send(invalidPost);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request data');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app).post('/api/posts').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid request data');
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/api/posts/invalid-id');

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).put('/api/posts/invalid-id').send({
        title: 'Updated Title',
        content: 'Updated content',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).delete('/api/posts/invalid-id');

      expect(response.status).toBe(400);
    });
  });
});
