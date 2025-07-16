import express from 'express';
import { createPostRoutes } from './posts/routes';
import { createCommentRoutes } from './comments/routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/posts', createPostRoutes());
app.use('/api/comments', createCommentRoutes());

app.get('/', (req, res) => {
  res.json({
    message:
      'REST API with Express 5, TypeScript, Zod, Drizzle and Layered Architecture',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
