import express from 'express';
import { createPostRoutes } from './posts/routes';
import { createCommentRoutes } from './comments/routes';
import { errorHandler } from '../common/middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/posts', createPostRoutes());
app.use('/api/comments', createCommentRoutes());

app.get('/health', (_req, res) => {
  res.json({
    message: 'API is running',
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
