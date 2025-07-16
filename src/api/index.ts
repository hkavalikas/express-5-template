import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { createPostRoutes } from './posts/routes';
import { createCommentRoutes } from './comments/routes';
import { createWebSocketRoutes } from './websocket/routes';
import { WebSocketService } from './websocket/WebSocketService';
import { errorHandler } from '../common/middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);

const wss = new WebSocketServer({ server });
const webSocketService = new WebSocketService(wss);

app.use(express.json());

app.use('/api/posts', createPostRoutes());
app.use('/api/comments', createCommentRoutes());
app.use('/api/chat', createWebSocketRoutes(webSocketService));

app.get('/health', (_req, res) => {
  res.json({
    message: 'API is running',
  });
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Chat server is ready on ws://localhost:${PORT}`);
});
